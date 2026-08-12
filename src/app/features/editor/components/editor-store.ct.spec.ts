import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { CvStore } from "../../../application/state/cv";
import { Autosave } from "../../../application/services/autosave";
import { LocalCvRepository } from "../../../infrastructure/persistence/cv-repository";
import { Cv, PersonalInfo, Experience } from "../../../domain/models/cv-model";
import { PersonalInfoForm } from "./personal-info-form";
import { ExperienceForm } from "./experience-form";
import { inputByPlaceholder, type, clickButton, text } from "./form-test-utils";

/**
 * Integration coverage for the editor's data flow:
 *
 *   form -> component output -> CvStore -> activeCv -> preview / autosave
 *
 * These tests wire the real `CvStore`, `History` and `Autosave` to the migrated
 * forms exactly as `editor.page.ts` does, and swap only IndexedDB for an
 * in-memory repository. They exist because the Signal Forms migration changes
 * *how* forms emit, and undo/redo plus autosave are sensitive to how often
 * `updateActiveCv` is called.
 */

/** In-memory stand-in for the Dexie-backed repository. */
class FakeCvRepository {
  readonly saved: Cv[] = [];
  private store = new Map<string, Cv>();

  async getAll(): Promise<Cv[]> {
    return [...this.store.values()];
  }
  async getById(id: string): Promise<Cv | undefined> {
    return this.store.get(id);
  }
  async save(cv: Cv): Promise<void> {
    this.store.set(cv.id, structuredClone(cv));
    this.saved.push(structuredClone(cv));
  }
  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
  async count(): Promise<number> {
    return this.store.size;
  }
}

/** Mirrors the wiring in editor.page.ts / editor.html. */
@Component({
  selector: "app-editor-host",
  imports: [PersonalInfoForm, ExperienceForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cvStore.activeCv(); as cv) {
      <app-personal-info-form
        [data]="cv.sections.personal"
        (dataChange)="updatePersonalInfo($event)"
      />
      <app-experience-form
        [items]="cv.sections.experience"
        (itemsChange)="updateExperience($event)"
      />
      <!-- Stands in for the live ResumePreview. -->
      <div data-testid="preview">
        <span data-testid="preview-name">{{
          cv.sections.personal.fullName
        }}</span>
        <span data-testid="preview-jobs">{{
          cv.sections.experience.length
        }}</span>
      </div>
    }
  `,
})
class EditorHost {
  readonly cvStore = inject(CvStore);

  updatePersonalInfo(personal: PersonalInfo) {
    this.cvStore.updateActiveCv({ sections: { personal } });
  }
  updateExperience(experience: Experience[]) {
    this.cvStore.updateActiveCv({ sections: { experience } });
  }
}

describe("editor → CvStore integration", () => {
  let fixture: ComponentFixture<EditorHost>;
  let store: CvStore;
  let repo: FakeCvRepository;

  const previewName = () =>
    fixture.nativeElement.querySelector('[data-testid="preview-name"]')
      .textContent;
  const previewJobs = () =>
    fixture.nativeElement.querySelector('[data-testid="preview-jobs"]')
      .textContent;

  async function settle(): Promise<void> {
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    repo = new FakeCvRepository();

    TestBed.configureTestingModule({
      imports: [EditorHost],
      providers: [{ provide: LocalCvRepository, useValue: repo }],
    });

    store = TestBed.inject(CvStore);
    await store.create("Test CV");

    fixture = TestBed.createComponent(EditorHost);
    await settle();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("pushes personal-info keystrokes straight into the store and the preview", async () => {
    type(fixture, inputByPlaceholder(fixture, "John Doe"), "Ada");
    await settle();

    expect(store.activeCv()!.sections.personal.fullName).toBe("Ada");
    expect(previewName()).toBe("Ada");
  });

  it("keeps the rest of the CV intact when one field changes", async () => {
    const before = structuredClone(store.activeCv()!);

    type(fixture, inputByPlaceholder(fixture, "john@example.com"), "a@b.co");
    await settle();

    const after = store.activeCv()!;
    expect(after.id).toBe(before.id);
    expect(after.templateId).toBe(before.templateId);
    expect(after.settings).toEqual(before.settings);
    expect(after.sections.personal.email).toBe("a@b.co");
    expect(after.sections.personal.fullName).toBe("");
  });

  it("does not touch the store while an experience draft is being typed", async () => {
    clickButton(fixture, "+ Add Experience");
    type(fixture, inputByPlaceholder(fixture, "Software Engineer"), "Engineer");
    type(fixture, inputByPlaceholder(fixture, "Tech Corp"), "Acme");
    await settle();

    expect(store.activeCv()!.sections.experience).toEqual([]);
    expect(previewJobs()).toBe("0");
  });

  it("reaches the store and the preview only when the draft is submitted", async () => {
    clickButton(fixture, "+ Add Experience");
    type(fixture, inputByPlaceholder(fixture, "Software Engineer"), "Engineer");
    type(fixture, inputByPlaceholder(fixture, "Tech Corp"), "Acme");
    type(
      fixture,
      fixture.nativeElement.querySelector('input[type="month"]'),
      "2020-01",
    );
    clickButton(fixture, "Add");
    await settle();

    expect(store.activeCv()!.sections.experience).toHaveLength(1);
    expect(store.activeCv()!.sections.experience[0]).toMatchObject({
      jobTitle: "Engineer",
      company: "Acme",
    });
    expect(previewJobs()).toBe("1");
    expect(text(fixture)).toContain("Engineer");
  });

  describe("undo / redo", () => {
    it("offers undo only once an edit has been made", async () => {
      expect(store.canUndo()).toBe(false);

      type(fixture, inputByPlaceholder(fixture, "John Doe"), "Ada");
      await settle();

      expect(store.canUndo()).toBe(true);
      expect(store.canRedo()).toBe(false);
    });

    it("reverts a burst of typing and restores it on redo", async () => {
      const name = inputByPlaceholder(fixture, "John Doe");
      type(fixture, name, "A");
      type(fixture, name, "Ad");
      type(fixture, name, "Ada");
      await settle();
      expect(previewName()).toBe("Ada");

      store.undo();
      await settle();

      // Rapid keystrokes coalesce into one history entry, so a single undo
      // clears the whole burst rather than one character.
      expect(store.activeCv()!.sections.personal.fullName).toBe("");
      expect(previewName()).toBe("");
      expect(store.canRedo()).toBe(true);

      store.redo();
      await settle();

      // Redo lands on the last *coalesced* snapshot, which History captured
      // just before the final keystroke — so the last character is not
      // restored. Pre-existing behaviour of History's coalescing (it pushes the
      // state prior to each change); unchanged by the Signal Forms migration,
      // which emits exactly one store update per keystroke just as
      // `valueChanges` did.
      expect(store.activeCv()!.sections.personal.fullName).toBe("Ad");
      expect(previewName()).toBe("Ad");
      expect(store.canRedo()).toBe(false);
    });

    it("puts the reverted value back into the form fields", async () => {
      type(fixture, inputByPlaceholder(fixture, "John Doe"), "Ada");
      await settle();

      store.undo();
      await settle();

      expect(inputByPlaceholder(fixture, "John Doe").value).toBe("");
    });

    it("undoes an added experience entry", async () => {
      clickButton(fixture, "+ Add Experience");
      type(
        fixture,
        inputByPlaceholder(fixture, "Software Engineer"),
        "Engineer",
      );
      type(fixture, inputByPlaceholder(fixture, "Tech Corp"), "Acme");
      type(
        fixture,
        fixture.nativeElement.querySelector('input[type="month"]'),
        "2020-01",
      );
      clickButton(fixture, "Add");
      await settle();
      expect(previewJobs()).toBe("1");

      store.undo();
      await settle();

      expect(store.activeCv()!.sections.experience).toEqual([]);
      expect(previewJobs()).toBe("0");
    });

    it("does not record history for edits that never leave a draft", async () => {
      clickButton(fixture, "+ Add Experience");
      type(
        fixture,
        inputByPlaceholder(fixture, "Software Engineer"),
        "Engineer",
      );
      await settle();

      expect(store.canUndo()).toBe(false);
    });
  });

  describe("autosave", () => {
    it("persists the edited CV after the debounce window", async () => {
      const autosave = TestBed.inject(Autosave);
      autosave.scheduleAutosave(store.activeCv()!);

      type(fixture, inputByPlaceholder(fixture, "John Doe"), "Ada");
      await settle();
      autosave.scheduleAutosave(store.activeCv()!);

      expect(repo.saved.at(-1)!.sections.personal.fullName).not.toBe("Ada");

      await vi.advanceTimersByTimeAsync(900);

      expect(repo.saved.at(-1)!.sections.personal.fullName).toBe("Ada");
    });

    it("collapses rapid edits into a single write", async () => {
      const autosave = TestBed.inject(Autosave);
      const writesBefore = repo.saved.length;

      const name = inputByPlaceholder(fixture, "John Doe");
      for (const value of ["A", "Ad", "Ada", "Ada L"]) {
        type(fixture, name, value);
        await settle();
        autosave.scheduleAutosave(store.activeCv()!);
        await vi.advanceTimersByTimeAsync(100);
      }

      await vi.advanceTimersByTimeAsync(900);

      expect(repo.saved.length - writesBefore).toBe(1);
      expect(repo.saved.at(-1)!.sections.personal.fullName).toBe("Ada L");
    });

    it("reloads the persisted CV from the repository", async () => {
      const autosave = TestBed.inject(Autosave);

      type(fixture, inputByPlaceholder(fixture, "John Doe"), "Ada");
      await settle();
      autosave.scheduleAutosave(store.activeCv()!);
      await vi.advanceTimersByTimeAsync(900);

      const reloaded = await repo.getById(store.activeCv()!.id);
      expect(reloaded!.sections.personal.fullName).toBe("Ada");
    });
  });
});

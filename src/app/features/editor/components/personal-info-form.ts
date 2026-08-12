import { ChangeDetectionStrategy, Component, model } from "@angular/core";
import { FormField, email, form, required } from "@angular/forms/signals";
import { VoltButton, VoltInput, VoltTextarea } from "@voltui/components";

import { PersonalInfo } from "../../../domain/models/cv-model";

const AVATAR_MAX_SIDE = 400;
const AVATAR_JPEG_QUALITY = 0.85;

/** Resize an image to fit within maxSide × maxSide and return a JPEG data URL. */
export function resizeImageToDataUrl(
  file: File,
  maxSide: number = AVATAR_MAX_SIDE,
  quality: number = AVATAR_JPEG_QUALITY,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > maxSide || height > maxSide) {
        const scale = maxSide / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Personal information editor — the one *continuously synchronised* form in the
 * editor: every keystroke must reach the store so the live preview updates
 * while typing.
 *
 * `data` is a `model()`, so the `WritableSignal` handed to `form()` writes
 * straight back out through `dataChange`. The store stays the single source of
 * truth and the component holds no copy of it: no `patchValue`, no
 * `valueChanges`, no mirroring `effect`. Values pushed in from the parent
 * update the fields without echoing back out, because writing an input does not
 * emit its change output.
 */
@Component({
  selector: "app-personal-info-form",
  imports: [FormField, VoltButton, VoltInput, VoltTextarea],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <h2 class="text-lg font-semibold text-foreground mb-4">
        Personal Information
      </h2>

      <!-- Avatar upload -->
      <div class="flex items-center gap-4">
        <div
          class="relative w-20 h-20 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center shrink-0"
        >
          @if (personalForm.avatarUrl().value()) {
            <img
              [src]="personalForm.avatarUrl().value()"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
          } @else {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          }
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground/80"
            >Profile Photo</label
          >
          <div class="flex items-center gap-2">
            <label
              class="px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground text-sm
                     hover:bg-accent cursor-pointer transition-all duration-200"
            >
              Upload
              <input
                type="file"
                accept="image/*"
                class="hidden"
                (change)="onAvatarSelected($event)"
              />
            </label>
            @if (personalForm.avatarUrl().value()) {
              <volt-button
                type="button"
                (click)="removeAvatar()"
                class="px-3 py-1.5 text-sm text-destructive hover:text-destructive/80 transition-colors"
              >
                Remove
              </volt-button>
            }
          </div>
          <p class="text-xs text-muted-foreground">
            Only shown in Creative, Modern & Executive templates
          </p>
        </div>
      </div>

      <form class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >Full Name *</label
            >
            <volt-input
              type="text"
              [formField]="personalForm.fullName"
              class="input-field"
              placeholder="John Doe"
            />
            @if (
              personalForm.fullName().touched() &&
              personalForm.fullName().invalid()
            ) {
              <p class="text-destructive text-xs mt-1">Full Name is required</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >Email *</label
            >
            <volt-input
              type="email"
              [formField]="personalForm.email"
              class="input-field"
              placeholder="john&#64;example.com"
            />
            @if (
              personalForm.email().touched() && personalForm.email().invalid()
            ) {
              <p class="text-destructive text-xs mt-1">
                Valid email is required
              </p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >Phone</label
            >
            <volt-input
              type="tel"
              [formField]="personalForm.phone"
              class="input-field"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >Location</label
            >
            <volt-input
              type="text"
              [formField]="personalForm.location"
              class="input-field"
              placeholder="New York, NY"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >Website</label
            >
            <volt-input
              type="url"
              [formField]="personalForm.website"
              class="input-field"
              placeholder="https://johndoe.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >LinkedIn</label
            >
            <volt-input
              type="url"
              [formField]="personalForm.linkedin"
              class="input-field"
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-foreground/80 mb-1.5"
            >Professional Summary</label
          >
          <volt-textarea
            [formField]="personalForm.summary"
            [rows]="4"
            class="input-field-resize-none"
            placeholder="Brief overview of your professional background and key achievements..."
          ></volt-textarea>
        </div>
      </form>
    </div>
  `,
})
export class PersonalInfoForm {
  /**
   * Two-way bound personal info. The parent passes the store's value in and
   * receives every edit back through `dataChange`.
   */
  readonly data = model.required<PersonalInfo>();

  protected readonly personalForm = form(this.data, (p) => {
    required(p.fullName);
    email(p.email);
  });

  protected onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    resizeImageToDataUrl(file)
      .then((dataUrl) => this.setAvatar(dataUrl))
      .catch(() => {
        // Fallback: store the original data URL if resizing fails.
        const reader = new FileReader();
        reader.onload = () => this.setAvatar(reader.result as string);
        reader.readAsDataURL(file);
      });
  }

  protected removeAvatar(): void {
    this.setAvatar("");
  }

  /**
   * The avatar lives in the same `PersonalInfo` model as every other field, so
   * writing it goes through the form like any other edit.
   */
  private setAvatar(avatarUrl: string): void {
    this.personalForm.avatarUrl().value.set(avatarUrl);
  }
}

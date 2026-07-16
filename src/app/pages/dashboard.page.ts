import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { CvStore } from "../application/state/cv";
import { Cv } from "../domain/models/cv-model";
import { DashboardHeader } from "../features/dashboard/components/dashboard-header";
import { EmptyState } from "../features/dashboard/components/empty-state";
import { CvCard } from "../features/dashboard/components/cv-card";
import { ConfirmDialog } from "../shared/components/confirm-dialog";

const DISMISS_BANNER_KEY = "cv-builder:backup-banner-dismissed";

@Component({
  selector: "app-dashboard",
  imports: [DashboardHeader, EmptyState, CvCard, ConfirmDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background">
      <div class="max-w-6xl mx-auto px-4 py-12">
        <app-dashboard-header
          (create)="createNew()"
          (importBackup)="importBackup($event)"
          (exportBackup)="exportBackup()"
        />

        <!-- Backup reminder banner -->
        @if (showBackupBanner()) {
          <div
            class="mb-6 p-4 rounded-xl border border-border bg-card/80 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div class="flex-1">
              <p class="text-sm text-foreground">
                <span class="font-semibold"
                  >Your resumes live only in this browser.</span
                >
                Download a backup copy to keep them safe.
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                (click)="exportBackup()"
                class="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Download Backup
              </button>
              <button
                (click)="dismissBackupBanner()"
                class="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        }

        <!-- Loading -->
        @if (cvStore.loading()) {
          <div class="flex items-center justify-center py-24">
            <div
              class="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"
            ></div>
          </div>
        }

        <!-- Empty state -->
        @if (!cvStore.loading() && cvStore.cvs().length === 0) {
          <app-empty-state (create)="createNew()" />
        }

        <!-- CV Grid -->
        @if (!cvStore.loading() && cvStore.cvs().length > 0) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (cv of cvStore.cvs(); track cv.id) {
              <app-cv-card
                [cv]="cv"
                (edit)="openEditor($event)"
                (duplicate)="duplicateCv($event)"
                (delete)="promptDeleteCv($event)"
                (renamed)="renameCv($event.id, $event.name)"
                (exportJson)="exportCvJson($event)"
              />
            }
          </div>
        }
      </div>
    </div>

    @if (deleteCandidate()) {
      <app-confirm-dialog
        [title]="'Delete resume'"
        [message]="deleteMessage()"
        [confirmLabel]="'Delete'"
        [destructive]="true"
        (confirm)="confirmDeleteCv()"
        (cancelled)="deleteCandidate.set(null)"
      />
    }
  `,
})
export default class Dashboard implements OnInit {
  readonly cvStore = inject(CvStore);
  private readonly router = inject(Router);

  protected showBackupBanner = signal(
    !localStorage.getItem(DISMISS_BANNER_KEY),
  );
  protected deleteCandidate = signal<Cv | null>(null);
  protected deleteMessage = computed(() => {
    const cv = this.deleteCandidate();
    return cv
      ? `Are you sure you want to delete "${cv.name}"? This action cannot be undone.`
      : "";
  });

  async ngOnInit() {
    await this.cvStore.loadAll();
  }

  protected async createNew() {
    const cv = await this.cvStore.create();
    if (cv) this.openEditor(cv.id);
  }

  protected openEditor(id: string) {
    this.router.navigate(["/editor"], { queryParams: { cv: id } });
  }

  protected async duplicateCv(id: string) {
    await this.cvStore.duplicate(id);
  }

  protected promptDeleteCv(cv: Cv) {
    this.deleteCandidate.set(cv);
  }

  protected async confirmDeleteCv() {
    const cv = this.deleteCandidate();
    this.deleteCandidate.set(null);
    if (cv) await this.cvStore.deleteById(cv.id);
  }

  protected renameCv(id: string, name: string) {
    this.cvStore.rename(id, name);
  }

  protected exportCvJson(cv: Cv) {
    this.cvStore.exportCv(cv);
  }

  protected exportBackup() {
    this.cvStore.exportAll();
  }

  protected async importBackup(file: File) {
    await this.cvStore.importAll(file);
  }

  protected dismissBackupBanner() {
    localStorage.setItem(DISMISS_BANNER_KEY, "true");
    this.showBackupBanner.set(false);
  }
}

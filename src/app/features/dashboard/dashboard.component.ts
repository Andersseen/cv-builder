import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from "@angular/core";
import { Router } from "@angular/router";
import { CvStore } from "../../application/state/cv.store";
import { Cv } from "../../domain/models/cv.model";
import { DashboardHeaderComponent } from "./components/dashboard-header.component";
import { EmptyStateComponent } from "./components/empty-state.component";
import { CvCardComponent } from "./components/cv-card.component";

@Component({
  selector: "app-dashboard",
  imports: [DashboardHeaderComponent, EmptyStateComponent, CvCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background">
      <div class="max-w-6xl mx-auto px-4 py-12">
        <app-dashboard-header (create)="createNew()" />

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
                (delete)="deleteCv($event)"
                (renamed)="onNameChange($event.id, $event.name)"
              />
            }
          </div>
        }
      </div>
    </div>
  `,
})
export default class DashboardComponent implements OnInit {
  readonly cvStore = inject(CvStore);
  private readonly router = inject(Router);

  async ngOnInit() {
    await this.cvStore.loadAll();
  }

  async createNew() {
    const cv = await this.cvStore.create();
    this.openEditor(cv.id);
  }

  openEditor(id: string) {
    this.router.navigate(["/editor"], { queryParams: { cv: id } });
  }

  async duplicateCv(id: string) {
    await this.cvStore.duplicate(id);
  }

  async deleteCv(cv: Cv) {
    if (confirm(`Delete "${cv.name}"? This cannot be undone.`)) {
      await this.cvStore.deleteById(cv.id);
    }
  }

  onNameChange(id: string, name: string) {
    this.cvStore.rename(id, name);
  }
}

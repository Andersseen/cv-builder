import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-cta",
  imports: [RouterLink],
  template: `
    <section class="bg-primary">
      <div
        class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-16"
      >
        <div>
          <h2
            class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            <span class="block text-primary-foreground"
              >Ready to create your professional resume?</span
            >
            <span class="block text-primary-100 dark:text-primary-200"
              >Start building for free today.</span
            >
          </h2>
          <p
            class="mt-4 text-lg leading-6 text-primary-100 dark:text-primary-200"
          >
            Join thousands of users who have landed their dream jobs.
          </p>
        </div>
        <div class="mt-8 flex lg:mt-0 lg:shrink-0">
          <div class="inline-flex rounded-md shadow">
            <a
              routerLink="/editor"
              class="inline-flex items-center justify-center rounded-md border border-transparent bg-background px-5 py-3 text-base font-medium text-primary hover:bg-surface-hover transition-colors"
            >
              Get Started
            </a>
          </div>
          <div class="ml-3 inline-flex rounded-md shadow">
            <a
              routerLink="/templates"
              class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-700 px-5 py-3 text-base font-medium text-white hover:bg-primary-800 transition-colors"
            >
              View Templates
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaComponent {}

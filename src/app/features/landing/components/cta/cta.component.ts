import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-cta",
  imports: [RouterLink],
  template: `
    <section
      class="relative isolate overflow-hidden bg-foreground py-24 sm:py-32"
    >
      <div class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2
            class="text-3xl font-bold tracking-tight text-background sm:text-4xl text-balance font-display"
          >
            Ready to land your dream job?
            <br />
            Start building for free today.
          </h2>
          <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-background/80">
            Join thousands of professionals who have advanced their careers with
            our resume builder. No credit card required.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <a
              routerLink="/dashboard"
              class="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:scale-105"
            >
              Get started
            </a>
            <a
              routerLink="/dashboard"
              class="text-sm font-semibold leading-6 text-white hover:text-primary transition-colors"
            >
              Browse templates <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
      <svg
        viewBox="0 0 1024 1024"
        class="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
        aria-hidden="true"
      >
        <circle
          cx="512"
          cy="512"
          r="512"
          fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
          fill-opacity="0.7"
        />
        <defs>
          <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
            <stop stop-color="#4f46e5" />
            <!-- Primary color -->
            <stop offset="1" stop-color="#171717" />
            <!-- Dark bg color -->
          </radialGradient>
        </defs>
      </svg>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaComponent {}

import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-cta",
  imports: [RouterLink],
  template: `
    <section
      class="relative isolate overflow-hidden bg-card border-t border-border mt-12"
    >
      <div class="px-6 py-24 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2
            class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance font-display leading-tight"
          >
            Ready to land your dream job?
            <br />
            <span class="text-primary">Start building for free today.</span>
          </h2>
          <p
            class="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground-foreground"
          >
            Join thousands of professionals who have advanced their careers with
            our resume builder. No credit card required.
          </p>
          <div class="mt-10 flex items-center justify-center gap-4">
            <a
              routerLink="/dashboard"
              class="rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground
                     shadow-lg shadow-primary/30 hover:shadow-glass hover:-translate-y-0.5
                     transition-all duration-300 active:scale-95 active:translate-y-0"
            >
              Get started
            </a>
            <a
              routerLink="/dashboard"
              class="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors duration-200"
            >
              Browse templates <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
      <!-- Background gradient -->
      <svg
        viewBox="0 0 1024 1024"
        class="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
        aria-hidden="true"
      >
        <circle
          cx="512"
          cy="512"
          r="512"
          fill="url(#cta-gradient)"
          fill-opacity="0.5"
        />
        <defs>
          <radialGradient id="cta-gradient">
            <stop stop-color="#6366f1" />
            <stop offset="1" stop-color="#171717" />
          </radialGradient>
        </defs>
      </svg>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cta {}

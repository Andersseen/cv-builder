import { Component, ChangeDetectionStrategy,   } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-hero",
  imports: [RouterLink],
  template: `
    <section
      class="relative overflow-hidden bg-background pt-24 pb-32 lg:pt-32 lg:pb-40"
    >
      <!-- Gradient orbs -->
      <div
        class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-60 animate-float"
      ></div>
      <div
        class="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[120px] opacity-50"
        style="animation-delay: 3s"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]"
      ></div>

      <div class="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div class="flex flex-col items-center text-center mb-16 lg:mb-24">
          <!-- Badge -->
          <div
            class="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold text-primary bg-primary/8 mb-8 ring-1 ring-inset ring-primary/15 animate-fade-in tracking-wide uppercase"
          >
            <span class="relative flex h-2 w-2 mr-2.5">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2 w-2 bg-primary"
              ></span>
            </span>
            Free · No Signup · 5 Templates
          </div>

          <!-- Headline -->
          <h1
            class="max-w-4xl text-5xl font-display font-bold tracking-tight text-foreground sm:text-7xl mb-8 animate-slide-up leading-[1.1]"
            style="animation-delay: 100ms;"
          >
            Craft your
            <span
              class="bg-gradient-to-r from-primary via-primary-500 to-accent bg-clip-text text-transparent"
            >
              perfect resume
            </span>
            in minutes
          </h1>

          <!-- Subtitle -->
          <p
            class="max-w-2xl text-lg leading-8 text-muted-foreground-foreground mb-12 animate-slide-up"
            style="animation-delay: 200ms;"
          >
            Join thousands of professionals who have secured their dream jobs
            using our modern, ATS-friendly resume builder. No design skills
            needed.
          </p>

          <!-- CTA Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-4 w-full justify-center animate-slide-up"
            style="animation-delay: 300ms;"
          >
            <a
              routerLink="/dashboard"
              class="group inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground
                     shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110
                     transition-all duration-300 hover:scale-[1.02]"
            >
              Start Building Free
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
            <a
              routerLink="/dashboard"
              class="inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold text-foreground
                     ring-1 ring-border hover:bg-card transition-all duration-300"
            >
              View Examples
            </a>
          </div>

          <!-- Social proof -->
          <div
            class="flex items-center gap-6 mt-12 animate-slide-up"
            style="animation-delay: 450ms;"
          >
            <div class="flex -space-x-2">
              <div
                class="w-8 h-8 rounded-full bg-primary/20 ring-2 ring-background flex items-center justify-center text-[10px] font-bold text-primary"
              >
                J
              </div>
              <div
                class="w-8 h-8 rounded-full bg-accent/20 ring-2 ring-background flex items-center justify-center text-[10px] font-bold text-accent"
              >
                S
              </div>
              <div
                class="w-8 h-8 rounded-full bg-primary-500/20 ring-2 ring-background flex items-center justify-center text-[10px] font-bold text-primary-500"
              >
                M
              </div>
              <div
                class="w-8 h-8 rounded-full bg-primary/20 ring-2 ring-background flex items-center justify-center text-[10px] font-bold text-primary"
              >
                A
              </div>
            </div>
            <div class="text-left">
              <div class="flex items-center gap-1">
                @for (_ of [1, 2, 3, 4, 5]; track $index) {
                  <svg
                    class="w-3.5 h-3.5 text-warning"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                }
              </div>
              <p class="text-xs text-muted-foreground-foreground mt-0.5">
                Trusted by
                <span class="font-semibold text-foreground">2,000+</span>
                professionals
              </p>
            </div>
          </div>
        </div>

        <!-- App mockup -->
        <div
          class="relative mx-auto max-w-5xl animate-slide-up"
          style="animation-delay: 500ms;"
        >
          <!-- Glow -->
          <div
            class="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-3xl blur-2xl opacity-40"
          ></div>
          <div
            class="relative rounded-2xl bg-card border border-border shadow-2xl shadow-primary/5 overflow-hidden"
          >
            <!-- Window chrome -->
            <div
              class="h-11 bg-card-alt border-b border-border flex items-center px-4 gap-2"
            >
              <div class="w-3 h-3 rounded-full bg-danger/60"></div>
              <div class="w-3 h-3 rounded-full bg-warning/60"></div>
              <div class="w-3 h-3 rounded-full bg-accent/60"></div>
              <div class="ml-4 flex-1 max-w-xs mx-auto">
                <div
                  class="h-5 bg-background rounded-md flex items-center justify-center"
                >
                  <span class="text-[10px] text-muted-foreground-foreground font-mono"
                    >cvbuilder.app/editor</span
                  >
                </div>
              </div>
            </div>
            <!-- Mockup content -->
            <div class="p-6 bg-background min-h-[320px] flex gap-6">
              <!-- Left panel (form) -->
              <div class="w-1/2 space-y-4">
                <div class="space-y-2">
                  <div class="h-3 w-20 bg-muted rounded"></div>
                  <div
                    class="h-8 w-full bg-card rounded-lg border border-border"
                  ></div>
                </div>
                <div class="space-y-2">
                  <div class="h-3 w-16 bg-muted rounded"></div>
                  <div
                    class="h-8 w-full bg-card rounded-lg border border-border"
                  ></div>
                </div>
                <div class="space-y-2">
                  <div class="h-3 w-24 bg-muted rounded"></div>
                  <div
                    class="h-20 w-full bg-card rounded-lg border border-border"
                  ></div>
                </div>
                <div class="flex gap-3 mt-4">
                  <div class="h-8 w-20 bg-primary rounded-lg"></div>
                  <div class="h-8 w-20 bg-muted rounded-lg"></div>
                </div>
              </div>
              <!-- Right panel (resume preview) -->
              <div
                class="w-1/2 bg-card rounded-lg shadow-sm border border-border p-5 space-y-3"
              >
                <div class="h-8 w-full bg-primary rounded"></div>
                <div class="space-y-1.5">
                  <div class="h-2.5 w-3/4 bg-muted rounded"></div>
                  <div class="h-2.5 w-full bg-muted/50 rounded"></div>
                  <div class="h-2.5 w-5/6 bg-muted/50 rounded"></div>
                </div>
                <div class="pt-2 space-y-1.5">
                  <div class="h-2.5 w-1/3 bg-primary/30 rounded"></div>
                  <div class="h-2.5 w-full bg-muted/50 rounded"></div>
                  <div class="h-2.5 w-4/5 bg-muted/50 rounded"></div>
                </div>
                <div class="pt-2 space-y-1.5">
                  <div class="h-2.5 w-1/4 bg-primary/30 rounded"></div>
                  <div class="flex gap-1.5">
                    <div class="h-5 w-12 bg-primary/10 rounded-full"></div>
                    <div class="h-5 w-14 bg-primary/10 rounded-full"></div>
                    <div class="h-5 w-10 bg-primary/10 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {}

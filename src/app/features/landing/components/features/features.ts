import { Component, ChangeDetectionStrategy,   } from "@angular/core";

@Component({
  selector: "app-features",
  template: `
    <section class="py-28 bg-surface-alt/50">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <!-- Section header -->
        <div class="mx-auto max-w-2xl lg:text-center mb-16">
          <p
            class="text-xs font-semibold leading-7 text-primary mb-3 tracking-[0.2em] uppercase"
          >
            Faster · Smarter · Better
          </p>
          <h2
            class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-display"
          >
            Everything you need to
            <br class="hidden sm:block" />
            build the perfect resume
          </h2>
          <p class="mt-6 text-lg leading-8 text-muted-foreground">
            We stripped away the clutter to focus on what matters: your content.
            Our tools help you articulate your value without fighting with
            formatting.
          </p>
        </div>

        <!-- Feature grid — bento style -->
        <div
          class="mx-auto grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-none"
        >
          <!-- Feature 1: Editor (large) -->
          <div
            class="col-span-1 sm:col-span-2 lg:col-span-2 relative overflow-hidden rounded-2xl bg-surface p-8 ring-1 ring-border
                   hover:ring-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
          >
            <div class="relative z-10">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-5 group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-foreground mb-2">
                Distraction-Free Editor
              </h3>
              <p class="max-w-xl text-sm leading-7 text-muted-foreground">
                Our minimalist editor keeps you focused on your content.
                Real-time preview updates instantly as you type, so you always
                know exactly how your resume looks.
              </p>
            </div>
            <div
              class="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl group-hover:from-primary/20 transition-colors duration-500"
            ></div>
          </div>

          <!-- Feature 2: PDF Export -->
          <div
            class="relative overflow-hidden rounded-2xl bg-surface p-8 ring-1 ring-border
                   hover:ring-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
          >
            <div class="relative z-10">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-background mb-5 group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-foreground mb-2">
                Instant PDF Export
              </h3>
              <p class="text-sm leading-7 text-muted-foreground">
                One click to download a perfectly formatted, ATS-compliant PDF.
                Crisp text at 3× resolution.
              </p>
            </div>
          </div>

          <!-- Feature 3: Templates (tall) -->
          <div
            class="row-span-2 relative overflow-hidden rounded-2xl bg-surface p-8 ring-1 ring-border
                   hover:ring-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
          >
            <div class="relative z-10 h-full flex flex-col">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary mb-5 group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-foreground mb-2">
                5 Professional Templates
              </h3>
              <p class="text-sm leading-7 text-muted-foreground mb-6">
                Choose from curated layouts designed by HR experts. Modern,
                Classic, Minimal, Creative and Executive — each ATS-optimized.
              </p>
              <!-- Mini template previews -->
              <div
                class="mt-auto grid grid-cols-5 gap-2 opacity-70 group-hover:opacity-100 transition-opacity"
              >
                <!-- Modern -->
                <div
                  class="aspect-[3/4] bg-background rounded-md border border-border overflow-hidden p-1.5"
                >
                  <div class="h-2 w-full bg-primary rounded-sm"></div>
                  <div class="mt-1 h-1 w-2/3 bg-muted rounded-sm"></div>
                  <div class="mt-1 h-1 w-full bg-muted/50 rounded-sm"></div>
                  <div class="mt-1 h-1 w-4/5 bg-muted/50 rounded-sm"></div>
                </div>
                <!-- Classic -->
                <div
                  class="aspect-[3/4] bg-background rounded-md border border-border overflow-hidden p-1.5"
                >
                  <div class="h-1.5 w-2/3 mx-auto bg-muted rounded-sm"></div>
                  <div class="mt-1 h-px w-full bg-border"></div>
                  <div class="mt-1 h-1 w-full bg-muted/50 rounded-sm"></div>
                  <div class="mt-1 h-1 w-4/5 bg-muted/50 rounded-sm"></div>
                </div>
                <!-- Minimal -->
                <div
                  class="aspect-[3/4] bg-background rounded-md border border-border overflow-hidden p-1.5"
                >
                  <div class="h-1.5 w-1/2 bg-muted rounded-sm"></div>
                  <div class="mt-2 h-1 w-full bg-muted/30 rounded-sm"></div>
                  <div class="mt-1 h-1 w-4/5 bg-muted/30 rounded-sm"></div>
                </div>
                <!-- Creative -->
                <div
                  class="aspect-[3/4] bg-background rounded-md border border-border overflow-hidden flex"
                >
                  <div class="w-1/3 bg-foreground/90 h-full"></div>
                  <div class="flex-1 p-1">
                    <div class="h-1 w-full bg-muted/50 rounded-sm"></div>
                    <div class="mt-1 h-1 w-3/4 bg-muted/50 rounded-sm"></div>
                  </div>
                </div>
                <!-- Executive -->
                <div
                  class="aspect-[3/4] bg-background rounded-md border border-border overflow-hidden p-1.5"
                >
                  <div class="h-3 w-full bg-foreground/80 rounded-sm"></div>
                  <div class="mt-1 h-1 w-full bg-muted/50 rounded-sm"></div>
                  <div class="mt-1 h-1 w-3/4 bg-muted/50 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feature 4: Privacy -->
          <div
            class="relative overflow-hidden rounded-2xl bg-surface p-8 ring-1 ring-border
                   hover:ring-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 group"
          >
            <div class="relative z-10">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent mb-5 group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-foreground mb-2">
                100% Private
              </h3>
              <p class="text-sm leading-7 text-muted-foreground">
                Your data never leaves your browser. We use local storage to
                keep your resume safe and private.
              </p>
            </div>
          </div>

          <!-- Feature 5: Fast -->
          <div
            class="relative overflow-hidden rounded-2xl bg-surface p-8 ring-1 ring-border
                   hover:ring-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
          >
            <div class="relative z-10">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10 text-warning mb-5 group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-foreground mb-2">
                Lightning Fast
              </h3>
              <p class="text-sm leading-7 text-muted-foreground">
                No sign-ups, no loading spinners. Start building instantly and
                see your resume come alive in real time.
              </p>
            </div>
          </div>

          <!-- Feature 6: Color Customization (NEW) -->
          <div
            class="relative overflow-hidden rounded-2xl bg-surface p-8 ring-1 ring-border
                   hover:ring-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
          >
            <div class="relative z-10">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5 group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-foreground mb-2">
                Color Customization
              </h3>
              <p class="text-sm leading-7 text-muted-foreground">
                Personalize your resume with 10 preset accent colors or pick any
                custom color with real-time preview.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Features {}

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-features",
  template: `
    <section class="py-32 bg-background">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:text-center mb-20">
          <h2
            class="text-base font-semibold leading-7 text-primary mb-2 tracking-wide uppercase"
          >
            Faster. Smarter. Better.
          </h2>
          <p
            class="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-display"
          >
            Everything you need to <br class="hidden sm:block" />build the
            perfect resume
          </p>
          <p class="mt-6 text-lg leading-8 text-muted-foreground">
            We stripped away the clutter to focus on what matters: your content.
            Our tools help you articulate your value without getting fighting
            with formatting.
          </p>
        </div>

        <div
          class="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-none lg:gap-8"
        >
          <!-- Feature 1: The Editor -->
          <div
            class="col-span-1 sm:col-span-2 lg:col-span-2 relative overflow-hidden rounded-3xl bg-surface p-8 ring-1 ring-border shadow-sm hover:shadow-lg transition-shadow duration-300 group"
          >
            <div class="relative z-10">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-foreground">
                Distraction-Free Editor
              </h3>
              <p
                class="mt-4 max-w-xl text-base leading-7 text-muted-foreground"
              >
                Our minimalist editor keeps you focused on your content.
                Real-time preview updates instantly as you type, so you always
                know exactly how your resume looks.
              </p>
            </div>
            <div
              class="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl group-hover:from-primary/30 transition-colors duration-500"
            ></div>
          </div>

          <!-- Feature 2: PDF Export -->
          <div
            class="relative overflow-hidden rounded-3xl bg-surface p-8 ring-1 ring-border shadow-sm hover:shadow-lg transition-shadow duration-300 group"
          >
            <div class="relative z-10">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-foreground">
                Instant PDF Export
              </h3>
              <p class="mt-4 text-base leading-7 text-muted-foreground">
                One click to download a perfectly formatted, ATS-compliant PDF.
              </p>
            </div>
          </div>

          <!-- Feature 3: Templates (Tall card) -->
          <div
            class="row-span-2 relative overflow-hidden rounded-3xl bg-surface p-8 ring-1 ring-border shadow-sm hover:shadow-lg transition-shadow duration-300 group"
          >
            <div class="relative z-10 h-full flex flex-col">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-foreground">
                Professional Templates
              </h3>
              <p class="mt-4 text-base leading-7 text-muted-foreground mb-8">
                Choose from our curated collection of clean, modern templates
                designed by HR experts to pass ATS bots.
              </p>
              <div
                class="mt-auto relative h-48 rounded-lg bg-background border border-border overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity"
              >
                <!-- Decorative mini-mockup -->
                <div
                  class="absolute top-4 left-4 right-4 h-2 w-1/3 bg-muted rounded"
                ></div>
                <div
                  class="absolute top-8 left-4 right-4 h-32 bg-muted/50 rounded"
                ></div>
              </div>
            </div>
          </div>

          <!-- Feature 4: Privacy -->
          <div
            class="relative overflow-hidden rounded-3xl bg-surface p-8 ring-1 ring-border shadow-sm hover:shadow-lg transition-shadow duration-300 group"
          >
            <div class="relative z-10">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-foreground">100% Private</h3>
              <p class="mt-4 text-base leading-7 text-muted-foreground">
                Your data never leaves your browser. We use local storage to
                keep your resume safe and private.
              </p>
            </div>
          </div>

          <!-- Feature 5: Real-time -->
          <div
            class="relative overflow-hidden rounded-3xl bg-surface p-8 ring-1 ring-border shadow-sm hover:shadow-lg transition-shadow duration-300 group"
          >
            <div class="relative z-10">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-foreground">Lightning Fast</h3>
              <p class="mt-4 text-base leading-7 text-muted-foreground">
                No sign-ups, no loading spinners. Start building instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesComponent {}

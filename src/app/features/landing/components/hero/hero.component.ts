import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-hero",
  imports: [RouterLink, NgOptimizedImage],
  template: `
    <section
      class="relative overflow-hidden bg-background pt-24 pb-32 lg:pt-32 lg:pb-40"
    >
      <!-- Decorator elements -->
      <div
        class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-50"
      ></div>
      <div
        class="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[120px] opacity-50"
      ></div>

      <div class="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div class="flex flex-col items-center text-center mb-16 lg:mb-24">
          <div
            class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-primary bg-primary/10 mb-8 ring-1 ring-inset ring-primary/20 animate-fade-in"
          >
            <span class="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            v1.0 is now live
          </div>

          <h1
            class="max-w-4xl text-5xl font-display font-bold tracking-tight text-foreground sm:text-7xl mb-8 animate-slide-up"
            style="animation-delay: 100ms;"
          >
            Craft your
            <span
              class="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
              >perfect resume</span
            >
            in minutes
          </h1>

          <p
            class="max-w-2xl text-lg leading-8 text-muted-foreground mb-10 animate-slide-up"
            style="animation-delay: 200ms;"
          >
            Join the thousands of professionals who have secured their dream
            jobs using our modern, ATS-friendly resume builder. No design skills
            needed.
          </p>

          <div
            class="flex flex-col sm:flex-row gap-4 w-full justify-center animate-slide-up"
            style="animation-delay: 300ms;"
          >
            <a
              routerLink="/editor"
              class="inline-flex items-center justify-center rounded-lg bg-foreground px-8 py-4 text-base font-semibold text-background shadow-lg hover:bg-foreground/90 transition-all hover:scale-105"
            >
              Start Building Free
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="ml-2 h-4 w-4"
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
              routerLink="/templates"
              class="inline-flex items-center justify-center rounded-lg px-8 py-4 text-base font-semibold text-foreground ring-1 ring-border hover:bg-surface hover:ring-foreground/20 transition-all"
            >
              View Examples
            </a>
          </div>
        </div>

        <div
          class="relative mx-auto max-w-5xl rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden animate-slide-up"
          style="animation-delay: 400ms;"
        >
          <div
            class="absolute top-0 w-full h-12 bg-muted/50 border-b border-border flex items-center px-4 space-x-2"
          >
            <div class="w-3 h-3 rounded-full bg-red-400"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div class="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div class="pt-12 bg-surface">
            <img
              ngSrc="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              width="1260"
              height="750"
              alt="Resume Builder Interface"
              class="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
              priority
            />
          </div>
          <div
            class="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl"
          ></div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {}

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-hero",
  imports: [RouterLink, NgOptimizedImage],
  template: `
    <section
      class="relative overflow-hidden bg-background pt-16 pb-32 md:pt-24 md:pb-48"
    >
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center"
        >
          <div class="max-w-2xl">
            <h1
              class="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl"
            >
              <span class="block xl:inline">Create stunning resumes</span>
              <span class="block text-primary xl:inline">that stand out</span>
            </h1>
            <p
              class="mt-4 text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0"
            >
              Build professional resumes with our easy-to-use editor. Choose
              from modern templates, customize them to your needs, and export as
              PDF.
            </p>
            <div
              class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a
                routerLink="/editor"
                class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:opacity-90 md:text-lg md:px-10 transition-opacity"
                aria-label="Create Resume"
              >
                Create Resume
              </a>
              <a
                routerLink="/templates"
                class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-secondary-foreground bg-secondary hover:bg-secondary/80 md:text-lg md:px-10 transition-colors"
                aria-label="Browse Templates"
              >
                Browse Templates
              </a>
            </div>
          </div>
          <div class="relative lg:col-start-2">
            <div
              class="relative rounded-xl shadow-2xl overflow-hidden bg-muted ring-1 ring-border"
            >
              <img
                ngSrc="https://images.pexels.com/photos/6355/desk-white-black-header.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                width="1260"
                height="750"
                alt="Resume preview"
                class="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {}

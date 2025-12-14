import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-hero",
  imports: [RouterLink, NgOptimizedImage],
  template: `
    <section
      class="relative overflow-hidden bg-white dark:bg-gray-900 pt-16 pb-32 md:pt-24 md:pb-48"
    >
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center"
        >
          <div class="max-w-2xl">
            <h1
              class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl"
            >
              <span class="block xl:inline">Create stunning resumes</span>
              <span
                class="block text-primary-600 dark:text-primary-400 xl:inline"
                >that stand out</span
              >
            </h1>
            <p
              class="mt-4 text-xl text-gray-500 dark:text-gray-300 max-w-lg mx-auto lg:mx-0"
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
                class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:text-lg md:px-10 transition-colors"
                aria-label="Create Resume"
              >
                Create Resume
              </a>
              <a
                routerLink="/templates"
                class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 md:text-lg md:px-10 transition-colors"
                aria-label="Browse Templates"
              >
                Browse Templates
              </a>
            </div>
          </div>
          <div class="relative lg:col-start-2">
            <div
              class="relative rounded-xl shadow-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-900/10 dark:ring-white/10"
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

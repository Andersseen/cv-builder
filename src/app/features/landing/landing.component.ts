import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-white dark:bg-gray-900">
      <!-- Hero section -->
      <section class="relative overflow-hidden">
        <div class="container mx-auto px-4 py-16 sm:py-24">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="max-w-lg">
              <h1
                class="text-4xl sm:text-5xl font-bold tracking-tight mb-6 animate-fade-in"
              >
                Create stunning resumes that stand out
              </h1>
              <p
                class="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up"
              >
                Build professional resumes with our easy-to-use editor. Choose
                from modern templates, customize them to your needs, and export
                as PDF.
              </p>
              <div class="flex flex-col sm:flex-row gap-4 animate-slide-up">
                <a
                  routerLink="/editor"
                  class="btn btn-primary px-8 py-3 text-base font-medium"
                >
                  Create Resume
                </a>
                <a
                  routerLink="/templates"
                  class="btn btn-secondary px-8 py-3 text-base font-medium"
                >
                  Browse Templates
                </a>
              </div>
            </div>
            <div class="hidden lg:block relative">
              <div class="relative rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.pexels.com/photos/6355/desk-white-black-header.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Resume preview"
                  class="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features section -->
      <section class="py-16 bg-gray-50 dark:bg-gray-800">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl mx-auto text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">Powerful Features</h2>
            <p class="text-lg text-gray-600 dark:text-gray-300">
              Everything you need to create the perfect resume
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div
              class="bg-white dark:bg-gray-700 rounded-lg shadow p-6 transform transition-transform hover:scale-105"
            >
              <div
                class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-primary-600 dark:text-primary-400"
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
              <h3 class="text-xl font-semibold mb-2">Easy-to-Use Editor</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Our intuitive editor makes it simple to create and customize
                your resume. No design skills required.
              </p>
            </div>

            <!-- Feature 2 -->
            <div
              class="bg-white dark:bg-gray-700 rounded-lg shadow p-6 transform transition-transform hover:scale-105"
            >
              <div
                class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-primary-600 dark:text-primary-400"
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
              <h3 class="text-xl font-semibold mb-2">Modern Templates</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Choose from a variety of professionally designed templates that
                will make your resume stand out.
              </p>
            </div>

            <!-- Feature 3 -->
            <div
              class="bg-white dark:bg-gray-700 rounded-lg shadow p-6 transform transition-transform hover:scale-105"
            >
              <div
                class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-primary-600 dark:text-primary-400"
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
              <h3 class="text-xl font-semibold mb-2">Export to PDF</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Download your finished resume as a professional PDF ready to
                send to employers.
              </p>
            </div>

            <!-- Feature 4 -->
            <div
              class="bg-white dark:bg-gray-700 rounded-lg shadow p-6 transform transition-transform hover:scale-105"
            >
              <div
                class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-primary-600 dark:text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Real-time Preview</h3>
              <p class="text-gray-600 dark:text-gray-300">
                See how your resume looks in real-time as you make changes to
                content and styling.
              </p>
            </div>

            <!-- Feature 5 -->
            <div
              class="bg-white dark:bg-gray-700 rounded-lg shadow p-6 transform transition-transform hover:scale-105"
            >
              <div
                class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-primary-600 dark:text-primary-400"
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
              <h3 class="text-xl font-semibold mb-2">Autosave</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Never lose your work with automatic saving to your browser's
                local storage.
              </p>
            </div>

            <!-- Feature 6 -->
            <div
              class="bg-white dark:bg-gray-700 rounded-lg shadow p-6 transform transition-transform hover:scale-105"
            >
              <div
                class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-primary-600 dark:text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Customizable Design</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Tailor the look and feel of your resume with custom colors,
                fonts, and layout options.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA section -->
      <section class="py-16 bg-primary-600 dark:bg-primary-800">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold text-white mb-6">
            Ready to create your professional resume?
          </h2>
          <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have successfully landed
            interviews with resumes created using our platform.
          </p>
          <a
            routerLink="/editor"
            class="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-base font-medium inline-block"
          >
            Get Started — It's Free!
          </a>
        </div>
      </section>
    </div>
  `,
})
export default class LandingComponent {}

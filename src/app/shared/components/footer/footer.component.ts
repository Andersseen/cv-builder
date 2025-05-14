import { Component } from "@angular/core";

@Component({
  selector: "app-footer",
  template: `
    <footer
      class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6"
    >
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              © {{ currentYear }} Modern CV Builder. All rights reserved.
            </p>
          </div>
          <div class="flex space-x-6">
            <a
              href="#"
              class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}

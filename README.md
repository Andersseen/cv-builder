# Modern CV Builder

Modern CV Builder is an Angular application that helps users create professional resumes in the browser. It provides structured forms, real-time previews, and PDF export capabilities powered by Tailwind CSS and modern web tooling.

## Features

- Forms for personal information, work experience, education, and skills
- Template selection and live resume preview
- Responsive layout with optional mobile preview
- One-click PDF export using `html-to-image`, `jspdf`, and `pdf-lib`

## Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- [pnpm](https://pnpm.io/) or npm

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start a development server at `http://localhost:4200/`:

```bash
pnpm start
```

Build the application for production:

```bash
pnpm build
```

## Project Structure

- `src/app/features/editor` – resume editor with form components and preview
- `src/app/features/landing` – landing page shown on first load
- `src/app/shared` and `src/app/core` – reusable utilities and services

## License

This project is licensed under the MIT License.

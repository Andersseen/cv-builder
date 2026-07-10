# Modern CV Builder

Modern CV Builder is a 100% client-side Angular 19 application (AnalogJS + Vite, zoneless, signals) that helps users create professional resumes in the browser. It provides structured forms, real-time previews, and PDF export. Everything is stored locally in IndexedDB — no backend, no account.

## Features

- Forms for personal info, experience, education, skills, projects, certifications, and languages
- Reorder list items (↑/↓) and light markdown (`**bold**`, `*italic*`, `-` bullets) in descriptions
- Template selection and live resume preview (5 distinct templates)
- Responsive layout with optional mobile preview
- One-click PDF export using `html-to-image` and `jspdf`, plus ATS-friendly print/PDF

## Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- [pnpm](https://pnpm.io/) or npm

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start a development server at `http://localhost:5173/`:

```bash
pnpm start
```

Build the application for production:

```bash
pnpm build
```

## Project Structure

- `src/app/pages` – file-based routed pages (landing, dashboard, editor)
- `src/app/features/editor` – resume editor with form components and preview
- `src/app/features/landing` – landing page components
- `src/app/shared` and `src/app/core` – reusable utilities and services

## License

This project is licensed under the MIT License.

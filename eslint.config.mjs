// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";

/**
 * Flat ESLint config for the CV Builder.
 *
 * Locks in the repo conventions (see docs/CONVENTIONS.md): standalone
 * components, `app-` selectors, signals-first. Template accessibility rules are
 * intentionally NOT enabled here yet — the a11y audit is a Phase 4 roadmap item.
 */
export default tseslint.config(
  {
    ignores: [
      "dist/**",
      ".angular/**",
      "node_modules/**",
      "src/main.server.ts",
      "src/app/app.config.server.ts",
    ],
  },
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" },
      ],
      // This repo deliberately omits type suffixes on class/file names
      // (see docs/CONVENTIONS.md golden rule #7: `Editor`, not `EditorComponent`).
      "@angular-eslint/component-class-suffix": "off",
      "@angular-eslint/directive-class-suffix": "off",
      // The store's deep-merge and the Dexie repository legitimately bridge
      // untyped boundaries; keep `any` a warning rather than a hard error.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [...angular.configs.templateRecommended],
    rules: {},
  },
);

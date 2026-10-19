import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default [
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/coverage/**",
      "**/playwright-report/**",
      "**/test-results/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    settings: {
      react: {
        version: "19.3.0",
      },
    },
  },
  {
    files: ["packages/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
    },
  },
  {
    files: [
      "e2e/**/*.{js,jsx,ts,tsx}",
      "scripts/**/*.{js,jsx,ts,tsx,mjs}",
      "playwright.config.ts",
      "vitest.config.ts",
      "vitest.setup.ts",
    ],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

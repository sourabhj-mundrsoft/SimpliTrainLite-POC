# Development Guide

## Prerequisites

- Node.js 20.9 or newer (use an active LTS release).
- pnpm 10.33.0 (the version pinned by the root `package.json`), managed through Corepack where available.
- Git and a browser supported by Playwright for end-to-end tests.

Use the package versions recorded in the root `package.json` and `README.md`. Keep Next.js, React, TypeScript, Tailwind CSS, and their peer dependencies on mutually compatible stable releases. Prefer the lockfile over floating package versions for reproducible installs.

## Install and run

From the repository root:

```sh
corepack enable
pnpm install
pnpm dev:app1
pnpm dev:app2
pnpm dev:app3
```

The applications are independent and listen on ports 3001, 3002, and 3003. The Reports page in Applications 1 and 2 needs the users service on `http://localhost:3000` (override with `USERS_API_URL` in the app's `.env.local`; see `.env.example`). `pnpm dev` starts all three through Turborepo. Each app can also be started, built, linted, and typechecked without requiring the other apps to be running.

## Repository boundaries

- `apps/simplitrain_lite`, `apps/application-2`, and `apps/application-3` own their route trees, root layouts, navigation configs (`src/navigation.ts`), theme tokens, and any app-specific API integration. The `simplitrain_lite` app retains the workspace package name `@lms/application-1`.
- All three apps render the shared SimpliTrain header from `@lms/shared-ui`'s `AppShell`. The shell renders only the navigation items the app passes in; it holds no app-specific routes.
- Applications may depend on explicitly listed packages under `packages/`; applications must not import from each other.
- Shared packages must not import from `apps/`.
- `@lms/users` is used only by Applications 1 and 2. Its UI receives an app-owned endpoint (`/api/users`); the upstream service URL lives in each app's server-side `USERS_API_URL`, never in the package.
- Workspace sharing means consumers pick up source changes on their next build. A change to `@lms/shared-ui` affects all three apps. A monorepo is not, by itself, an independent package release boundary; publish and pin semantic versions when independently versioned releases are required.

## Quality checks

Run the root checks before submitting changes:

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

Vitest is used for unit and integration tests. Playwright provides browser smoke tests for each app; install its browser binaries when prompted by the test runner. Tests cover the shared `AppShell` (rendered navigation, active item, header utilities); the users API client, route handlers, grid and Create User modal; and, per app, the exact navigation items, that each item opens its page and becomes active, that removed routes return 404, and (with `/api/users` mocked so no real users are created) that Reports shows the grid and creates a user.

When changing a single app, run its focused checks first, then the root checks to verify workspace consumers and package boundaries. Turborepo may cache deterministic tasks; use its normal task outputs and cache behavior.

## Adding an application

1. Create a standalone Next.js App Router app under `apps/` with its own package manifest, TypeScript configuration, theme tokens, `src/navigation.ts`, and routes.
2. Add `@lms/shared-ui` (dependency, `transpilePackages`, and a Tailwind `@source` line) and render `AppShell` in the root layout. Add only the other shared workspace packages it uses.
3. Add its own API adapters and environment configuration; never import from another app.
4. Assign a distinct development port and include the app in the root Turborepo development task.
5. Add app-specific unit/e2e coverage and update the README's application matrix and run instructions.

## Adding a shared module

1. Create a package under `packages/` with a small, explicit public API and a workspace package manifest.
2. Keep app routing, endpoint URLs, branding, and layouts in the consuming application.
3. Add the package only to applications that include the module.
4. Add tests for the package contract and verify every consumer builds.
5. Document compatibility and use semantic versioning if the package is published separately.

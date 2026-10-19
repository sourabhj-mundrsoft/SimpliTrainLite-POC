# SimpliTrain Multi-Application Platform — POC Architecture & Development Guide

## 1. Purpose

Build a proof of concept for the SimpliTrain platform using **multiple independent Next.js applications in a single monorepo**, with reusable, shared packages.

The POC must demonstrate:

- Three independently runnable/deployable Next.js applications with different URLs.
- A common SimpliTrain header layout shared by all three applications through a workspace package.
- A different navigation set per application, defined by the application, not by the shared layout.
- A shared Users module (`@lms/users`: users grid and Create User modal) used by Applications 1 and 2 on their Reports page, backed by the users service API.
- Application-level independence: changing one application's routes/navigation must not require changes to the other applications.
- Shared package boundaries and version/release considerations.
- TypeScript, linting, tests, and clear developer documentation.

This is a POC, not a production LMS. Page bodies are placeholders; header utilities (language, support, notifications, cart, user) are presentational.

## 2. Non-goals

Do not implement these unless explicitly requested:

- Microfrontend runtime/module federation.
- A single deployed host shell that dynamically loads all applications at runtime.
- Permission/RBAC as the mechanism for deciding which navigation items an app shows.
- A full LMS backend, real authentication, payments, or production database.
- Copying the same layout source into each app.
- Kubernetes or complex cloud infrastructure.

## 3. Architecture decision

Use a **monorepo with multiple Next.js applications and shared workspace packages**.

- Each application owns its routes, root layout, navigation config, theme tokens, pages, any API integration, and deployment pipeline.
- The shared header layout lives in `@lms/shared-ui`. It is a reusable component that renders whatever navigation an app passes in; it is not a runtime host for the apps.
- Applications may import shared packages; shared packages must not import from `apps/*`.
- Applications must never import from one another.
- A shared package source change can affect all consumers after they rebuild. Independent deployment is achieved through separate app builds/deployments and, when required, versioned published packages. A monorepo alone does not guarantee release isolation.

### Logical diagram

```text
lms-platform (monorepo)
├── apps/
│   ├── application-1  ── Home, Admin, Reports
│   ├── application-2  ── Home, Reports, Accounting, Settings
│   └── application-3  ── Home, Course Catalog, Event Schedule
│
└── packages/
    ├── shared-ui      ── AppShell (SimpliTrain header layout), CategoryCards, SectionSidebar, PagePlaceholder
    └── users          ── UsersPanel (grid + Create User modal), API client, /api/users route handlers
```

### Runtime/deployment concept

```text
https://app1.local.test  → Application 1 deployment
https://app2.local.test  → Application 2 deployment
https://app3.local.test  → Application 3 deployment
```

For local development, different ports are sufficient. In deployment, each app can have its own domain and pipeline.

## 4. Technology stack

- pnpm workspaces
- Turborepo
- Next.js App Router
- React
- TypeScript with strict mode
- Tailwind CSS (theme tokens app-owned as CSS variables)
- Vitest for unit tests
- ESLint and Prettier
- Playwright for a small end-to-end smoke test suite

TanStack Query (data fetching/caching) and Zod (API response validation) are used by `@lms/users`. Use compatible, mutually supported stable package versions and record them in the README.

## 5. Monorepo structure

```text
lms-platform/
├── apps/
│   ├── application-1/
│   │   ├── src/app/            (layout.tsx, page.tsx, admin/, reports/)
│   │   ├── src/navigation.ts
│   │   ├── package.json
│   │   └── next.config.ts
│   ├── application-2/
│   │   └── ...same app-owned structure...
│   └── application-3/
│       └── ...same app-owned structure...
├── packages/
│   └── shared-ui/
│       ├── src/
│       └── package.json
├── e2e/
├── docs/
│   └── ARCHITECTURE.md
├── scripts/check-boundaries.mjs
├── DEVELOPMENT.md
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── eslint.config.mjs
├── .prettierrc.json
└── README.md
```

Do not create empty packages without a demonstrated use.

## 6. Application/navigation matrix

| Application   | Example URL             | Navigation                           |
| ------------- | ----------------------- | ------------------------------------ |
| Application 1 | `http://localhost:3001` | Home, Admin, Reports                 |
| Application 2 | `http://localhost:3002` | Home, Reports, Accounting, Settings  |
| Application 3 | `http://localhost:3003` | Home, Course Catalog, Event Schedule |

Each navigation item maps to a route in that app. An item's absence from an app is due to route/navigation composition, not permission checks.

## 7. Shared layout package design

### `@lms/shared-ui`

Responsibilities:

- `AppShell`: the SimpliTrain header — logo, main navigation with active-route underline, language selector, support/notification/cart buttons, and user avatar — plus the `main` landmark.
- `PagePlaceholder`: a titled card for pages without real content yet.
- Accept navigation items (`href`, `label`, `icon`), user (`name`, `initials`), `cartCount`, and `hasUnreadNotifications` as props.
- Read colors from app-owned CSS variables (`--color-primary`, `--color-background`, `--color-text`).
- No hardcoded app routes other than `/` for the logo, no API URLs, and no imports from apps.
- Accessibility: semantic landmarks, skip link, `aria-current` on the active item, labeled icon buttons, visible focus, responsive layout down to phone width.

### `@lms/users`

Responsibilities:

- `UsersPanel`: users grid (search, pagination, loading/empty/error states) and a `+ Create User` button that opens `CreateUserModal`.
- A users API client that validates and maps the service's snake_case payloads and produces readable error messages.
- `@lms/users/server`: `createUsersRouteHandlers({ upstreamUrl })` for each app's same-origin `/api/users` route.
- No hardcoded service URL in the package: the UI receives the app's endpoint, and the route receives `USERS_API_URL`.

Users service API (`SimplitrainMonolithAppBackend`, default `http://localhost:3000`):

- `GET /api/users` returns `{ success, count, data: User[] }`.
- `POST /api/users` requires `first_name`, `primary_email`, `password`; returns 201 `{ data }` or 400/409 `{ message }`.

## 8. Theme and layout

All three applications share the same header layout, but each has its own theme:

| App           | Theme                  | Primary   | Background |
| ------------- | ---------------------- | --------- | ---------- |
| Application 1 | Ocean blue (light)     | `#1d4ed8` | `#eaf1ff`  |
| Application 2 | Forest green (light)   | `#15803d` | `#ecf6ef`  |
| Application 3 | Midnight purple (dark) | `#c084fc` | `#0f0a1f`  |

Each app declares its theme as CSS variables in its own `globals.css`: `--color-primary`, `--color-on-primary` (text on primary), `--color-brand-accent` (logo), `--color-background`, `--color-surface`, `--color-surface-muted`, `--color-text`, `--color-text-muted`, `--color-text-subtle` and `--color-border`. Shared components (`@lms/shared-ui`, `@lms/users`) use only these variables for surfaces, text, borders and primary actions, never fixed colors, so the same component renders correctly in a light or dark theme. Changing an app's theme means editing only that app's tokens; the shared packages and other apps are untouched.

## 9. Routing and application independence

- Application 1: `/`, `/admin`, `/reports` (Users module), `/api/users`
- Application 2: `/`, `/reports` (Users module), `/accounting`, `/settings`, `/api/users`
- Application 3: `/`, `/course-catalog`, `/event-schedule`

Do not create cross-app redirects or import routes from another app. Routes that an app does not define return a normal 404.

## 10. Workspace dependencies and versioning

Use workspace dependencies for the POC:

```json
{
  "dependencies": {
    "@lms/shared-ui": "workspace:*"
  }
}
```

For production evolution:

- Keep package public APIs explicit and small.
- Add tests for shared packages.
- Use semantic versioning if packages are published to a registry and apps need different versions.
- For a workspace-only POC, a source change to a shared package is picked up by all consumers on their next build. Workspace dependencies alone do not prevent a shared change from affecting every app.
- CI should build/test only affected apps/packages where practical, but always verify all consumers before releasing a breaking change.

## 11. Root scripts and developer experience

- `pnpm dev:app1`, `pnpm dev:app2`, `pnpm dev:app3`
- `pnpm dev` to run all apps concurrently (separate ports)
- `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`

App-specific scripts must run individually without requiring other apps to be running.

## 12. Quality requirements

- TypeScript `strict: true`; avoid `any`.
- No circular dependencies, no application-to-application imports, no shared-package-to-app imports.
- Keep server/client component boundaries deliberate; add `"use client"` only where required (the shell needs it for `usePathname`).
- Responsive UI for desktop and mobile; accessible labels, keyboard navigation, focus indicators, semantic landmarks, adequate contrast.
- No hardcoded secrets; use environment variables for environment-specific configuration.
- Avoid premature abstractions and overengineering.

## 13. Testing requirements

1. Unit tests for `AppShell`: renders exactly the passed navigation, marks the active route, shows header utilities.
1. Unit tests for `@lms/users`: response mapping, create payload, client errors, route handlers (including 502), grid search and pagination, and the Create User modal success and error paths.
1. Playwright smoke tests per app: title, logo, exact navigation items, each item opens its page and becomes active.
1. Playwright checks that removed routes return 404.
1. `pnpm check:boundaries` enforces import rules.
1. Root lint, typecheck, build, and test commands must pass.

## 14. Acceptance criteria

- [ ] All three Next.js apps exist in one pnpm/Turborepo monorepo.
- [ ] All three apps run individually on ports 3001, 3002, and 3003.
- [ ] All three apps render the shared SimpliTrain header layout.
- [ ] Application 1 shows Home, Admin, Reports.
- [ ] Application 2 shows Home, Reports, Accounting, Settings.
- [ ] Application 3 shows Home, Course Catalog, Event Schedule.
- [ ] Each navigation item opens its page and is highlighted as active.
- [ ] Reports in Applications 1 and 2 lists users from `GET /api/users` and creates users with `POST /api/users`; Application 3 does not depend on `@lms/users`.
- [ ] No app imports another app; no shared package imports from an app.
- [ ] Typecheck, lint, tests, and builds pass.
- [ ] README explains setup, commands, architecture, and how to add an app/page/module.

## 15. How to add another application

1. Create a new folder under `apps/` and scaffold its Next.js app with its own port.
2. Add `@lms/shared-ui` (dependency, `transpilePackages`, Tailwind `@source`).
3. Define theme tokens in `globals.css` and navigation in `src/navigation.ts`.
4. Render `AppShell` in the root layout and add a route per navigation item.
5. Do not import from another application.
6. Add its own build/deploy pipeline, environment variables, and e2e coverage; update the navigation matrix.

## 16. How to add a new shared module

1. Create a package under `packages/` with a clear public API.
2. Keep app-specific routing, endpoint URLs, and branding decisions out of the package.
3. Add the package only to apps that need it.
4. Provide app-owned API adapters when endpoints or response shapes differ between apps.
5. Add unit tests and document the package contract.

## 17. Final design principles

1. **Applications are independent products**: their routes, navigation, theme tokens, API integration, and deployment belong to each app.
2. **Shared packages are explicit contracts**: the header layout is shared; what it shows is decided by each app.
3. **No accidental coupling**: no cross-app imports and no package imports from app code.
4. **Independent deployment needs release discipline**: separate pipelines and versioned package releases when strict release isolation is required.
5. **Start small**: grow page content and shared modules only when a real need appears.

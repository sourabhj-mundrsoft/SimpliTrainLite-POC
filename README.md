# SimpliTrain Multi-Application POC

A pnpm/Turborepo monorepo containing three separately runnable Next.js applications and two shared workspace packages: `@lms/shared-ui` (layout) and `@lms/users` (user management). All three apps render the same SimpliTrain header layout; each app owns its navigation items, pages, theme tokens, and deployable build.

## Applications

| Application   | Local URL               | Navigation                           | Routes                                      |
| ------------- | ----------------------- | ------------------------------------ | ------------------------------------------- |
| Application 1 | `http://localhost:3001` | Home, Admin, Reports                 | `/`, `/admin`, `/reports`                   |
| Application 2 | `http://localhost:3002` | Home, Reports, Accounting, Settings  | `/`, `/reports`, `/accounting`, `/settings` |
| Application 3 | `http://localhost:3003` | Home, Course Catalog, Event Schedule | `/`, `/course-catalog`, `/event-schedule`   |

The **Reports** page in Applications 1 and 2 shows the User Management screen from `@lms/users`: category cards, a section sidebar, a searchable, paginated users grid, and a Create User modal. Other pages are titled placeholders. The header contains the SimpliTrain logo, the app's navigation (active item underlined), a language selector, support, notification and cart buttons, and the signed-in user's avatar. These utilities are visual only in this POC.

## Prerequisites and setup

- Node.js 20.9 or newer.
- pnpm 10.33.0 (pinned in `package.json`; use Corepack if needed).

```sh
corepack enable
pnpm install
```

Run one application at a time:

```sh
pnpm dev:app1
pnpm dev:app2
pnpm dev:app3
```

The Reports page needs the users service (`SimplitrainMonolithAppBackend`) running on `http://localhost:3000`. To point an app elsewhere, copy its `.env.example` to `.env.local` and set `USERS_API_URL`.

Or run all three concurrently with `pnpm dev`. Each app can also be built/deployed independently with `pnpm --filter @lms/application-1 build` (and likewise for `-2` and `-3`).

## Commands

| Command                                           | Description                                                 |
| ------------------------------------------------- | ----------------------------------------------------------- |
| `pnpm dev`                                        | Run all applications through Turborepo                      |
| `pnpm dev:app1`, `pnpm dev:app2`, `pnpm dev:app3` | Run an individual application                               |
| `pnpm build`                                      | Build all apps                                              |
| `pnpm lint`                                       | Lint apps, packages, and test/guardrail source              |
| `pnpm typecheck`                                  | Typecheck apps and shared packages                          |
| `pnpm check:boundaries`                           | Verify workspace import rules                               |
| `pnpm test`                                       | Run boundary checks and unit tests                          |
| `pnpm test:e2e`                                   | Start the three apps and run Playwright browser smoke tests |

Playwright uses Chromium. Install the browser once with `pnpm exec playwright install chromium` if it is not available locally.

## Architecture and boundaries

```text
apps/
  application-1/  ── navigation config + Home, Admin, Reports pages
  application-2/  ── navigation config + Home, Reports, Accounting, Settings pages
  application-3/  ── navigation config + Home, Course Catalog, Event Schedule pages
packages/
  shared-ui/      ── AppShell (SimpliTrain header layout), CategoryCards, SectionSidebar, PagePlaceholder
  users/          ── UsersPanel (grid + Create User modal), users API client, /api/users route handlers
```

- Each app's root layout renders `<AppShell navigation={...} user={...}>` with its own `src/navigation.ts`. The shell never decides which items an app shows.
- Applications 1 and 2 use `@lms/users`; Application 3 does not. Each of those apps exposes a same-origin `/api/users` route (built with `createUsersRouteHandlers` from `@lms/users/server`) that forwards GET and POST to `USERS_API_URL`. The browser never calls the users service directly, because the service sends no CORS headers.
- Apps never import one another; shared packages never import application code.
- Each app has its own theme: Application 1 ocean blue, Application 2 forest green, Application 3 dark midnight purple. Theme tokens (`--color-primary`, `--color-surface`, `--color-text`, `--color-border` and others) are defined in each app's `globals.css`; shared components only read them.
- Turborepo coordinates local tasks; it does not make a shared workspace package an independent release boundary. A change to `@lms/shared-ui` is picked up by all three apps on their next build. Publish and pin semantic versions if deployments need release isolation.

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md), [docs/DEPLOYMENT_AND_CI_CD.md](./docs/DEPLOYMENT_AND_CI_CD.md), [DEVELOPMENT.md](./DEVELOPMENT.md), and [POC_ARCHITECTURE.md](./POC_ARCHITECTURE.md) for details.

## Toolchain versions

The lockfile pins the dependency graph. Direct framework/test versions are:

| Tool                          | Version         |
| ----------------------------- | --------------- |
| pnpm                          | 10.33.0         |
| Turborepo                     | 2.11.7          |
| Next.js                       | 16.4.0          |
| React / React DOM             | 19.3.0          |
| TypeScript                    | 5.9.3           |
| Tailwind CSS / PostCSS plugin | 4.3.3           |
| TanStack Query                | 5.104.2         |
| Zod                           | 4.6.7           |
| ESLint / `eslint-config-next` | 9.39.5 / 16.4.0 |
| Vitest / Vite                 | 5.0.4 / 8.3.4   |
| Playwright                    | 1.64.0          |

Next 16.4's ESLint config and its React/JSX accessibility plugins declare ESLint 9 peer ranges; ESLint 9 is pinned rather than forcing ESLint 10 and violating those peers.

## Adding an app, page, or module

- **New navigation item/page:** add a route folder under the app's `src/app/` and an entry in its `src/navigation.ts`. Available icons are listed by the `IconName` type in `@lms/shared-ui`.
- **New app:** create a standalone Next.js app under `apps/` with its own manifest, port, `globals.css` tokens, `navigation.ts`, and root layout that renders `AppShell`. Add `@lms/shared-ui` to its dependencies and `transpilePackages`, add an `@source` line for the package in `globals.css`, then add e2e coverage.
- **New shared module:** create a package with a narrow public API under `packages/`, keep endpoints and app-specific behavior in the consuming apps, add it only to the apps that need it, and test every consumer.

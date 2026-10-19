# Architecture

## Composition

This POC composes independent applications at build/deployment time in one pnpm workspace. It does not use runtime module federation, microfrontends, a dynamically composed host shell, or permissions to choose navigation items.

| App                  | Port | Navigation                           | Routes                                      |
| -------------------- | ---: | ------------------------------------ | ------------------------------------------- |
| `@lms/application-1` | 3001 | Home, Admin, Reports                 | `/`, `/admin`, `/reports`                   |
| `@lms/application-2` | 3002 | Home, Reports, Accounting, Settings  | `/`, `/reports`, `/accounting`, `/settings` |
| `@lms/application-3` | 3003 | Home, Course Catalog, Event Schedule | `/`, `/course-catalog`, `/event-schedule`   |

Every app owns its App Router tree, root layout, navigation config, theme variables, and production build. A route that is not in an app's tree returns the normal Next.js 404.

## Shared layout: `@lms/shared-ui`

All three apps use the same SimpliTrain header layout, provided by the `AppShell` client component:

- SimpliTrain logo linking to `/`.
- Main navigation built from the `navigation` prop. The item matching the current path (`usePathname`) gets `aria-current="page"` and a primary-colored underline.
- Header utilities: language selector, support, notifications (optional unread dot), cart (optional count badge), and user avatar/name. These are presentational in the POC.
- Skip link and a `main#main-content` landmark wrapping the page.

`PagePlaceholder` renders a titled card used by every current page.

The package's public API is:

```ts
type NavigationItem = { href: string; label: string; icon: IconName };
type ShellUser = { name: string; initials: string };

<AppShell
  navigation={navigation}
  user={user}
  cartCount={3}
  hasUnreadNotifications
>
  {children}
</AppShell>
```

Shared components read theme tokens that each app defines in its own `globals.css`: `--color-primary`, `--color-on-primary` (text on primary), `--color-brand-accent` (logo), `--color-background`, `--color-surface`, `--color-surface-muted`, `--color-text`, `--color-text-muted`, `--color-text-subtle` and `--color-border`. Each app has a different theme:

| App                                                                                                          | Theme                  | Primary   | Background |
| ------------------------------------------------------------------------------------------------------------ | ---------------------- | --------- | ---------- |
| Application 1                                                                                                | Ocean blue (light)     | `#1d4ed8` | `#eaf1ff`  |
| Application 2                                                                                                | Forest green (light)   | `#15803d` | `#ecf6ef`  |
| Application 3                                                                                                | Midnight purple (dark) | `#c084fc` | `#0f0a1f`  |
| Each app compiles the package source through `transpilePackages` and includes it in Tailwind with `@source`. |

## Users module: `@lms/users`

Used by Applications 1 and 2 on their `/reports` page; Application 3 does not depend on it.

- `UsersPanel` (client component) takes an app-owned `endpoint` (`"/api/users"`). It loads users with TanStack Query, shows them in `UsersGrid` (search, 10 per page, loading/empty/error states), and opens `CreateUserModal` (native `<dialog>`) to create a user. After a successful create, the users query refreshes.
- Each app chooses the grid columns with the optional `columns` prop (`UserColumn[]`). Application 1 shows User with email underneath, Employee code, Department, Designation, Date of joining, and Status. Application 2 also shows separate Email and Phone columns, plus City, Country, Date of joining, Role, and Status.
- `createUsersClient(endpoint)` validates responses with Zod, maps the service's snake_case fields to a `User` model, and turns service errors (for example a duplicate email, 409) into readable messages.
- `@lms/users/server` exports `createUsersRouteHandlers({ upstreamUrl })`. Each app's `src/app/api/users/route.ts` uses it to forward GET/POST to `USERS_API_URL` (default `http://localhost:3000/api/users`). It returns 502 if the service is unreachable.
- The app supplies the `QueryClientProvider` (`src/components/query-provider.tsx`) and the page composition (category card and sidebar data in `src/app/reports/admin-sections.ts`).

Users service contract (`SimplitrainMonolithAppBackend`):

| Call              | Body / response                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `GET /api/users`  | `{ success, count, data: [{ id, first_name, last_name, primary_email, role, department, status, ... }] }`                            |
| `POST /api/users` | Requires `first_name`, `primary_email`, `password`; `status` is active, inactive or suspended. 201 `{ data }`, 400/409 `{ message }` |

## Dependency direction

```text
application-1 ─┬──► @lms/shared-ui ──► next, react (peers)
application-2 ─┤
application-3 ─┘

application-1 ─┬──► @lms/users ──► zod; react, @tanstack/react-query (peers)
application-2 ─┘
       │
       └── /api/users route ──► USERS_API_URL (users service)
```

No app imports another app. Packages do not import app code. `pnpm check:boundaries` scans every folder under `apps/` and `packages/` to enforce these rules.

## Sharing and release isolation

Workspace dependencies make local development and atomic changes straightforward. They do not isolate releases: each consumer resolves the workspace package source when it builds, so a change to the shared header affects all three apps on their next builds. For independently versioned releases, publish packages to a registry, use semantic versions, and update each app to the version it adopts. Apps still build and deploy independently; a workspace alone does not establish immutable release artifacts.

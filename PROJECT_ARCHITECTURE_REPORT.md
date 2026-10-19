# SimpliTrain Project Architecture Report

## Executive summary

SimpliTrain is currently a proof of concept (POC) for running three related web applications from one shared code repository. Each application has its own pages, navigation, visual theme, and build. They reuse common interface components and, where needed, a shared user-management feature.

This design aims to balance two needs: teams can work on or release each application separately, while common features can be built once and reused. The shared code is connected to the applications in the repository, so changes to shared components can affect every application that uses them when those applications are rebuilt.

## A simple way to picture it

Think of the repository as one workshop with three separate products:

- Each application is a product with its own pages, menu, colors, and release.
- Shared packages are reusable parts, such as the common header and user-management screen.
- The users service is a separate system that supplies and saves user information.
- pnpm and Turborepo help install dependencies and run common development and build tasks.

```text
One repository
├── Application 1 ──┐
├── Application 2 ──┼── Shared header and interface components
└── Application 3 ──┘
       │
       └── Applications 1 and 2 also use the shared Users feature
                       │
                       └── Their server routes connect to the users service
```

## What is in the project

| Part | What it does |
| --- | --- |
| Applications 1, 2, and 3 (`apps/`) | Separate Next.js web applications. Each owns its pages, routes, navigation, theme, and production build. |
| Shared UI (`packages/shared-ui/`) | Provides the common SimpliTrain header and reusable page components. Each application supplies its own menu and theme. |
| Users module (`packages/users/`) | Provides the shared user-management screen, user grid, create-user dialog, and API helpers. Applications 1 and 2 use it; Application 3 does not. |
| Users service | A separate backend service used by the Reports pages in Applications 1 and 2 to load and create users. It is not one of the three frontend applications in this repository. |
| Workspace tooling | pnpm manages the repository's packages. Turborepo coordinates tasks such as running and building applications. |

## The three applications

Each application runs independently during development and can be built and deployed separately.

| Application | Local address | Main sections |
| --- | --- | --- |
| Application 1 | `http://localhost:3001` | Home, Admin, Reports |
| Application 2 | `http://localhost:3002` | Home, Reports, Accounting, Settings |
| Application 3 | `http://localhost:3003` | Home, Course Catalog, Event Schedule |

Each app defines its own menu. The common header displays the menu it receives; it does not decide which sections a user is allowed to access. In this POC, the header's language, support, notification, and cart controls are visual elements rather than connected business features.

Applications 1 and 2 show the user-management feature on their Reports page. The other page content is currently made up of placeholders, so the project demonstrates the layout and application structure rather than a complete learning-management system.

## How user information moves through the system

The browser uses an app route rather than calling the backend service directly:

1. A user opens Reports in Application 1 or 2.
2. The shared Users screen asks that application's `/api/users` route for data.
3. The route forwards the request to the separately running users service.
4. The service returns user data, which the shared module validates and displays.
5. When a user is created, the request follows the same route back to the service, and the screen refreshes its data.

This keeps the service address on the server side and avoids requiring the browser to call a service that does not provide cross-origin browser access. The service address can be configured with `USERS_API_URL`; the local default is `http://localhost:3000/api/users`.

## What this structure means for the business

### Benefits

- **Separate application ownership:** A change to one app's pages or navigation does not require changing the other apps.
- **Consistent shared experience:** Common interface elements can be maintained in one place rather than copied into each application.
- **Independent app builds:** Each app can be built and deployed on its own.
- **Different branding where needed:** Shared components use each app's theme, allowing the applications to have different color schemes.
- **A clear way to grow:** New common features can be placed in shared packages and included only in the apps that need them.

### Important considerations

- **Shared changes need coordination:** When a shared package changes, every app that uses it may pick up that change on its next build. The monorepo does not automatically give shared packages version-based release isolation.
- **Independent deployment is not runtime composition:** These are separate applications, not one application that loads other apps dynamically. Each app has its own routes and build.
- **The backend is a separate dependency:** Reports in Applications 1 and 2 need the users service to be available. If it cannot be reached, the app's API route reports that the service is unavailable.
- **The POC is not production-complete:** Most page bodies are placeholders, and the header utility controls are not wired to real services. The architecture does not itself provide production authentication, permissions, payments, or a complete LMS backend.
- **Navigation is not access control:** Showing or hiding menu items is not a substitute for enforcing permissions on protected pages and APIs.

If teams later need shared components to be released on a schedule independent of the applications, the shared packages can be published with versions, and each app can adopt a specific version.

## Development and quality checks

Developers can run an individual app or all three through the workspace tooling. The project also includes linting, TypeScript checks, unit tests, browser-based end-to-end smoke tests, and a check that enforces the separation between apps and shared packages.

## Bottom line

This project demonstrates a practical starting structure for three related SimpliTrain applications: separate products, one repository, and reusable common features. It provides a foundation for independent application development and deployment, while keeping shared user-interface code consistent. Before treating it as a production LMS, the remaining application pages and business services—including real authentication and authorization—would need to be implemented and reviewed.

## Further reading

- [README.md](./README.md) — setup, application URLs, and available commands.
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — architecture details and dependency boundaries.
- [DEVELOPMENT.md](./DEVELOPMENT.md) — development workflow and quality checks.

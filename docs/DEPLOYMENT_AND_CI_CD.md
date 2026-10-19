# Deployment and CI/CD Guide

## 1. Overview

This repository contains three separate Next.js applications in one pnpm workspace. Deploy them as three application instances/projects, not as one combined website:

| Application   | Workspace package    | Local port | Uses the users service? |
| ------------- | -------------------- | ---------: | ----------------------- |
| Application 1 | `@lms/application-1` |       3001 | Yes                     |
| Application 2 | `@lms/application-2` |       3002 | Yes                     |
| Application 3 | `@lms/application-3` |       3003 | No                      |

The shared UI and Users modules live in `packages/`. Keep the full workspace available during dependency installation and builds so each app can resolve its shared workspace packages.

The repository now includes a GitHub Actions workflow at `.github/workflows/ci.yml`. It verifies pull requests and pushes to `main`; it does not deploy by itself. Production deployment should happen only after those checks pass.

## 2. Recommended release flow

1. A developer opens a pull request.
2. GitHub Actions installs the locked dependencies and runs lint, typecheck, unit/boundary tests, production builds, and browser end-to-end tests.
3. Reviewers merge only when the required CI check succeeds.
4. The hosting platform builds and deploys the changed application(s) from the approved branch.
5. The team checks the deployed URLs and confirms that Applications 1 and 2 can reach the users service.

Use a staging environment and deploy there before production when the hosting platform and team process support it.

## 3. Hosting options

### Option A: Managed Next.js hosting (recommended for this POC)

A platform with first-class Next.js support (for example, Vercel) can build and run each app without managing Node servers or a reverse proxy. Create one hosting project per app, all connected to this repository:

| Hosting project | Root directory       |
| --------------- | -------------------- |
| Application 1   | `apps/application-1` |
| Application 2   | `apps/application-2` |
| Application 3   | `apps/application-3` |

For each project:

1. Connect the GitHub repository and select the appropriate app root directory.
2. Ensure the platform installs from the pnpm workspace root and includes workspace files outside the app directory. Shared packages are located in `packages/`; a build that omits them will fail.
3. Use the platform's detected Next.js build settings where possible. If a build command must be set explicitly, run the workspace-filtered command from the repository/workspace context:
   - `pnpm --filter @lms/application-1 build`
   - `pnpm --filter @lms/application-2 build`
   - `pnpm --filter @lms/application-3 build`
4. Assign a separate domain or subdomain to each app, such as `app1.example.com`, `app2.example.com`, and `app3.example.com`.
5. Configure each project's environment variables (see section 5).
6. Set the production branch to `main`. Configure the host to deploy pull requests as previews and deploy production after a merge to `main`.

Hosting-provider interfaces and monorepo settings change over time. Confirm that the selected platform supports pnpm workspaces, Next.js 16, Node.js 20.9 or newer, and package source located outside the configured app root before adopting it.

### Option B: Deploy on a Node.js server or container platform

Use this option if the organization already runs Node.js services or containers. The host must support Node.js 20.9 or newer and keep all workspace files available through dependency installation and builds.

From the repository root on the deployment machine or in a deployment image:

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm build
```

Run each built application as its own long-running process:

```sh
pnpm --filter @lms/application-1 start
pnpm --filter @lms/application-2 start
pnpm --filter @lms/application-3 start
```

The apps listen on ports 3001, 3002, and 3003 respectively. Use the organization's process manager or container scheduler to keep them running and restart them when needed. Put an HTTPS-enabled reverse proxy or load balancer in front of the processes and route each public hostname to its corresponding port. Do not expose the app ports directly to the public internet unless that is an intentional network design.

Configure production environment variables through the hosting platform, container runtime, or secret manager. Do not commit production environment files to the repository.

## 4. GitHub Actions setup

The workflow file is `.github/workflows/ci.yml`. GitHub automatically discovers workflows in this directory; no third-party GitHub App or deployment secret is required for the CI checks in this workflow.

### Enable and check the workflow

1. Push the branch containing `.github/workflows/ci.yml` to GitHub.
2. Open the repository's **Actions** tab and confirm the **CI** workflow runs for a pull request or push to `main`.
3. The workflow uses Node.js 22 (compatible with the project's `>=20.9.0` requirement) and pnpm 10.33.0, matching the repository's package-manager pin.
4. It installs dependencies with `pnpm install --frozen-lockfile` and runs the same checks developers can run locally:
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm test`
   - `pnpm build`
   - `pnpm exec playwright test --workers=2`
5. In GitHub repository settings, protect `main` and require the **Validate workspace** check before merging. Also require review if that is part of the team's review policy.

Pull requests do not need access to production credentials: this workflow only validates code and runs local browser tests. Playwright test results are uploaded for seven days when a job fails.

### Add automatic deployment

The CI workflow intentionally does not publish to a hosting provider because no provider, credentials, or deployment environment is configured in this repository. The simplest setup is to connect each managed-hosting project to GitHub and let that provider deploy preview builds for pull requests and production builds from `main`, while GitHub branch protection requires CI to pass before merging.

If deployments must be initiated by GitHub Actions instead, add a separate deployment job after `validate` succeeds. Configure credentials as repository or environment secrets, use a protected GitHub `production` environment with required approval if appropriate, and use the hosting provider's official action or CLI. Do not put access tokens, private keys, or backend credentials in the workflow source or plain repository variables.

## 5. Environment configuration

Applications 1 and 2 expose a same-origin `/api/users` route, which forwards requests to the separately hosted users service. Set `USERS_API_URL` for each of those deployed apps to the users service's full reachable URL, for example:

```text
USERS_API_URL=https://users-api.example.com/api/users
```

The URL must be reachable from the app's server runtime, not merely from a user's browser. Use the staging service URL in staging and the production service URL in production. Application 3 does not use this variable.

The checked-in examples currently use different local ports: Application 1's `.env.example` uses port `9000` and Application 2's uses port `3000`, while the route handler fallback is port `3000`. Treat these as local examples only; confirm the actual backend port and configure the correct production URL explicitly for both applications.

Store environment-specific values in the hosting platform or secret manager. Do not store real credentials or production `.env` files in Git. The users service should be protected and reachable only over the approved network path; adding a frontend route does not replace authentication or authorization on the service.

## 6. First deployment checklist

- [ ] Confirm the target hosting platform supports Next.js 16, Node.js 20.9+, pnpm workspaces, and shared packages outside an app's root directory.
- [ ] Create one project/service per application and assign its root directory, hostname, and port/routing.
- [ ] Confirm lockfile-based installation and a successful production build for each app.
- [ ] Set the correct `USERS_API_URL` for Applications 1 and 2 and check server-to-server connectivity.
- [ ] Enable HTTPS and configure DNS for each hostname.
- [ ] Verify the home page and app navigation for each deployed app.
- [ ] Verify `/reports` and user listing/creation in Applications 1 and 2 against a non-production users service before production use.
- [ ] Protect `main` and require the GitHub Actions **Validate workspace** status check.
- [ ] Decide who approves production releases and how to roll back a bad deployment.
- [ ] Before production use, implement and review real authentication, authorization, service protections, monitoring, and operational recovery. This repository is a POC and does not provide these production controls by itself.

## 7. Useful local commands

```sh
# Start one app locally
pnpm dev:app1
pnpm dev:app2
pnpm dev:app3

# Run the same checks as CI
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

See [README.md](../README.md) for project setup and [docs/ARCHITECTURE.md](./ARCHITECTURE.md) for application and package boundaries.

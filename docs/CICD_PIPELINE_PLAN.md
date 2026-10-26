# CI/CD Pipeline Plan

## 1. Purpose and recommendation

This repository is a pnpm/Turborepo monorepo with three separately deployable
Next.js applications and two shared workspace packages. The goal is to let an
application change be checked and released independently, while still checking
every consumer when shared code changes.

Keep the monorepo and workspace packages for now. Use dependency-aware CI and
deploy each application as a separate hosting project. Do not publish the
packages as independent artifacts unless the team needs versioned releases that
consuming applications can adopt at different times.

This document is the target plan, not a claim that deployment automation is
already configured. The current [GitHub Actions workflow](../.github/workflows/ci.yml)
runs a full-workspace validation on pull requests and pushes to `main`. It does
not deploy applications.

## 2. Current repository topology

| Workspace | Directory | Shared dependencies | Current deployment unit |
|---|---|---|---|
| `@lms/application-1` | `apps/simplitrain_lite` | `@lms/shared-ui`, `@lms/users` | SimpliTrain Lite |
| `@lms/application-2` | `apps/application-2` | `@lms/shared-ui`, `@lms/users` | Application 2 |
| `@lms/application-3` | `apps/application-3` | `@lms/shared-ui` | Application 3 |
| `@lms/shared-ui` | `packages/shared-ui` | — | No independent runtime |
| `@lms/users` | `packages/users` | — | No independent runtime |

Each application has its own routes, theme, build, runtime configuration, and
hosting project. Apps 1 and 2 also use the server-side `USERS_API_URL`
configuration. None of the apps imports another app.

Package dependencies currently use `workspace:*`. A workspace package change
therefore changes the source used the next time each consumer is built; packages
are not immutable releases in this setup.

## 3. Change impact and release matrix

| Changed paths | CI scope | Production deployment scope |
|---|---|---|
| `apps/simplitrain_lite/**` | SimpliTrain Lite | SimpliTrain Lite |
| `apps/application-2/**` | Application 2 | Application 2 |
| `apps/application-3/**` | Application 3 | Application 3 |
| `packages/shared-ui/**` | All three apps and the package | All three apps |
| `packages/users/**` | Applications 1 and 2 and the package | Applications 1 and 2 |
| Root manifests, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `turbo.json`, shared test/lint/build configuration, or workflow logic | Broad workspace validation; deployment scope reviewed based on output/build impact | All apps if their runtime/build output may change; otherwise none |
| Documentation-only paths | Documentation checks, if configured | None |

Treat an uncertain or unclassified code/configuration change as affecting all
apps. A false-positive build is safer than silently missing a consumer.

### Isolation guarantees

- An app-only change builds and deploys only that app, provided path detection
  and hosting project triggers are configured as described below.
- CI still checks the app's workspace dependencies where needed. Building an app
  does not deploy those dependency packages as services.
- A local workspace package change must rebuild and deploy every app that
  consumes that package for those apps to receive the updated code.
- A package publish, if introduced later, does not change an app that is already
  deployed. The app must adopt that package version and be built and deployed.

## 4. Target pull request CI

### 4.1 Workflow stages

1. **Checkout and install**
   - Check out enough Git history for change detection (`fetch-depth: 0` is the
     simplest reliable choice).
   - Set up the Node.js version supported by the root manifest and the pinned
     pnpm version.
   - Install with `pnpm install --frozen-lockfile`.
   - Keep lockfile changes reviewed and committed with dependency changes.

2. **Detect changes**
   - Classify changed files into the three app scopes, the two package scopes,
     root/shared configuration, and documentation.
   - Prefer a maintained path-filter action or a small repository-owned detector
     that emits explicit outputs such as `app1`, `app2`, `app3`, and
     `all_apps`.
   - For a package change, set the flags for all its consumers from the matrix
     above.
   - Treat unknown source/config paths as broad-impact changes.
   - On merge queues, unusual pushes, missing base history, or detector errors,
     fall back to all relevant checks rather than silently skipping CI.

3. **Run affected workspace checks**
   - Run lint, typecheck, and production build for each affected app.
   - Preserve dependency ordering through Turborepo. For example:

     ```sh
     pnpm exec turbo run lint typecheck build --filter=@lms/application-1...
     ```

     The suffix `...` includes the app's workspace dependencies. For a changed
     shared package and all its dependents, use:

     ```sh
     pnpm exec turbo run lint typecheck build --filter=@lms/shared-ui...
     ```

     Use `@lms/users...` for the package and its consumers (Applications 1 and
     2). These filters follow the package graph; keep the explicit impact matrix
     as the source of deployment scope.

   - The applications currently have no package-level `test` script, while
     root `pnpm test` runs the boundary check and the complete Vitest suite.
     Keep that root test command in required PR validation until tests are
     deliberately split into package/app-level scripts. Do not pretend a
     filtered Turbo `test` task covers tests when no such task is registered.

4. **Run integration and browser checks**
   - Keep the existing Playwright end-to-end suite as a broad integration
     check: it starts and exercises all three applications.
   - Initially run it for all code/configuration changes. It can be narrowed
     later only after the Playwright projects and fixtures can reliably start
     and test apps independently.
   - Continue uploading Playwright results when a run fails.

5. **Publish a stable required status**
   - Run the workflow for every pull request. Avoid top-level path filters that
     cause the entire workflow to be skipped: GitHub can then leave a required
     status pending or missing.
   - Skip unaffected app jobs inside the workflow, but provide a stable final
     required-check job that reports success only when all applicable checks
     have succeeded or been intentionally skipped.
   - Give the check a stable name and require it in branch protection for
     `main`.

### 4.2 Change detection and Turborepo

GitHub path detection decides which app jobs and deploy jobs are eligible.
Turborepo's package graph decides which workspace tasks and dependencies those
jobs need to run. These are related but distinct concerns:

- The GitHub detector must map `packages/shared-ui/**` to all three consumers
  and `packages/users/**` to Applications 1 and 2.
- Turborepo filters should include dependencies when validating a selected app
  and dependents when validating a changed package.
- Any root or global configuration change that can affect builds must broaden
  validation/deployment scope.
- If using Turborepo's `--affected`, ensure the checkout has sufficient history
  and use the correct base commit for pull requests and pushes. Fall back to a
  full run if the comparison cannot be made safely.

Do not rely on app directory paths alone for dependency change detection:
shared package files are outside `apps/`.

## 5. Target deployment flow

Create three separate hosting projects connected to this repository:

| Hosting project | Root directory | Production target |
|---|---|---|
| SimpliTrain Lite | `apps/simplitrain_lite` | SimpliTrain Lite |
| Application 2 | `apps/application-2` | Application 2 |
| Application 3 | `apps/application-3` | Application 3 |

The deployment platform must support the pnpm workspace: installs and builds
must be able to access the repository root, lockfile, and `packages/` source
even though each project has an app-specific root directory. Confirm support for
the repository's Next.js and Node.js versions before choosing a host.

### Pull request previews

- Create previews only for affected apps.
- A shared UI change should create a preview for all three apps; a users package
  change should create previews for Applications 1 and 2.
- Preview environments must use non-production service URLs and credentials.
- Do not expose production secrets to pull-request workflows, especially for
  contributions from forks.

### Production releases

1. Protect `main`; require the stable CI check and review policy before merge.
2. On a push to `main`, use the same impact mapping to identify production
   deployment jobs.
3. Deploy only affected apps after their required checks pass.
4. Use separate production environment configuration for each app. Require
   approval for production if the release policy calls for it.
5. Run post-deployment smoke checks against the deployed URL and record the
   deployment result/commit.
6. Keep a documented rollback path, usually redeploying the previous known-good
   build or reverting the commit and deploying again.

Choose one production deployment trigger:

- **Hosting-provider Git integration:** connect each host project to its app
  directory, configure its monorepo-aware ignored-build/change settings, and
  let the provider create previews and production deployments. Confirm that
  provider change detection includes shared package dependencies.
- **GitHub Actions deployment:** use provider-supported actions/CLI in
  deployment jobs that depend on successful CI. Store credentials as protected
  GitHub environment secrets or use the provider's supported OIDC flow.

Do not enable both automatic production deploys from the host and separate
GitHub Actions production deploys unless duplicate deploys are explicitly
intended.

Applications 1 and 2 need `USERS_API_URL` configured separately in preview,
staging, and production. Application 3 does not currently need it. Keep
environment-specific values and credentials in the host or secret manager, not
in Git.

## 6. Shared package lifecycle

### Recommended now: private workspace packages

Keep `@lms/shared-ui` and `@lms/users` private and use their current
`workspace:*` dependencies. This keeps local development and coordinated
changes simple.

- A package is compiled as part of each consuming app's build; it has no
  separate production deployment in its current role.
- For `@lms/shared-ui`, validate and redeploy all three apps.
- For `@lms/users`, validate and redeploy Applications 1 and 2 only.
- Do not deploy Application 3 for a users-only change unless a root/shared
  change also affects it.
- If independent app release timing is important but source stays in this
  monorepo, use immutable build artifacts or versioned packages; simply making
  app deployments separate does not freeze their workspace dependencies.

### Optional later: independently versioned registry packages

Publish packages only when applications need to adopt package changes on
different schedules or when packages need consumers outside this monorepo. This
is a larger change, not required for the current CI/CD setup.

Before publishing:

1. Make the package distributable: define its public exports, build output,
   declaration files, included files, peer dependencies, and supported Node.js
   versions.
2. Assign semantic versions and change `private: true` only when publication is
   intended. Replace consumer `workspace:*` specifications with explicit
   registry version ranges and commit lockfile updates.
3. Select a registry (for example, GitHub Packages), configure package
   visibility/permissions, and verify that CI and deployment hosts can install
   the package.
4. Add a release process (for example, Changesets) that reviews version bumps,
   changelogs, and breaking changes.
5. Publish only after package checks pass. Use a protected release environment
   and least-privilege credentials or trusted publishing/OIDC where supported.
6. After publishing, update only apps that intentionally adopt the new version;
   test and deploy those apps. A package release by itself does not deploy or
   update consumers.

Publishing a package as a library is distinct from deploying a service. If a
package later owns a separately running API/service, that service needs its own
deployment unit, health checks, secrets, scaling, and backward-compatible API
release policy.

## 7. Caching and reliability

- Cache pnpm's package store and use the lockfile as the dependency cache key.
- Use Turborepo local/remote caching for repeatable build, lint, and typecheck
  tasks. Remote caching is an optimization, never a substitute for required
  checks.
- Include environment variables that affect task output in the task cache
  configuration. Do not put secrets in logs or cache outputs.
- Do not cache deployment credentials, `.env` files, or generated files that
  are not declared as task outputs.
- Use workflow concurrency groups to cancel superseded PR runs without
  cancelling a production deployment midway.
- Set job timeouts, retain useful failure artifacts for a limited period, and
  avoid granting write permissions to jobs that only validate code.
- Keep third-party GitHub Actions pinned and reviewed according to repository
  policy.

## 8. Rollout phases

### Phase 1 — CI baseline and merge protection

- Keep the current full-workspace CI as the safe baseline.
- Confirm it passes on pull requests and pushes to `main`.
- Protect `main` and require the current stable CI check.
- Configure project environments and verify secrets are not committed.

### Phase 2 — Selective checks

- Add change detection and the explicit impact matrix.
- Add app-scoped lint/typecheck/build jobs and package-consumer fan-out.
- Retain root tests and full Playwright coverage until they are safely
  partitioned.
- Compare selective results with full CI for several PRs before making selective
  results the sole required validation.

### Phase 3 — Preview and production deployment

- Create and validate one hosting project per app.
- Enable affected-app previews.
- Enable production deployment only after merge and successful required checks.
- Add post-deploy smoke tests, monitoring/alerts, release records, and rollback
  instructions.

### Phase 4 — Optional package publishing

- Start only when independent package version adoption is a real requirement.
- Build the distributable package format, registry access, versioning,
  publishing, consumer update, and release approval flow.

## 9. Acceptance checklist

- [ ] An Application 1-only change checks and deploys only Application 1.
- [ ] An Application 2-only change checks and deploys only Application 2.
- [ ] An Application 3-only change checks and deploys only Application 3.
- [ ] A `shared-ui` change checks and deploys all three apps.
- [ ] A `users` change checks and deploys Applications 1 and 2, but not 3.
- [ ] Root/lockfile/workflow changes trigger safe broad validation.
- [ ] No relevant change can silently skip the required PR status.
- [ ] Production deployments cannot run before merge and successful required CI.
- [ ] PR previews never receive production credentials.
- [ ] `USERS_API_URL` is correctly configured for each environment in Apps 1
  and 2; App 3 has no unnecessary users-service dependency.
- [ ] A failed deployment is observable and a rollback procedure is tested.
- [ ] If packages are published, releasing a package does not silently change
  existing apps; consumers move only through reviewed version updates.

## 10. Related documentation

- [Deployment and CI/CD guide](./DEPLOYMENT_AND_CI_CD.md)
- [Architecture](./ARCHITECTURE.md)
- [Project README](../README.md)

# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This is the Angular front-end for the AEMUD association management portal. It provides dashboards and workflows for:
- Member lifecycle (registration, CRUD, contributions, history)
- Mandats and phases
- Session / club / commission configuration
- Contributions tracking
- Notifications and user administration

The front-end is served either by the Angular dev server during development or as a static SPA behind Nginx / Spring Boot in production.

Key domain/API contracts are documented in:
- `API_DOCUMENTATION.md`
- `MEMBER_ENDPOINTS.md`
- `USER_CONTROLLER_ENDPOINTS.md`

UI/UX constraints for some domains are in:
- `MANDAT_MANAGEMENT_CONSTRAINT.md`
- `MANDAT_UI_UX_PROPOSAL.md`
- `USER_UI_UX_PROPOSAL.md`

## Commands & workflows

All commands are intended to be run at the repo root.

### Install dependencies

```bash
npm install
```

### Start local development (Angular + mocked API)

In one terminal, start the mocked backend (served from `data/db.json`):
```bash
npm run start:db
```

In another terminal, start the Angular dev server (uses the `development` environment by default):
```bash
npm start
# or equivalently
npx ng serve
```

By default the app is available at `http://localhost:4200/`.

### Run unit tests

Run the full Karma/Jasmine test suite:
```bash
npm test
# or
npx ng test
```

Run a single spec file (replace the path with the desired spec):
```bash
npx ng test --include src/app/shared/components/notification-popover/notification-popover.component.spec.ts
```

### Linting

Angular ESLint is wired via the Angular CLI target:
```bash
npm run lint
# or
npx ng lint
```

### Builds

The `build` script currently runs `ng build --watch` (useful during iterative development builds):
```bash
npm run build
```

For a one-off production build (without watch) that uses `environment.production.ts` and outputs to the Spring Boot static dir configured in `angular.json`:
```bash
npx ng build --configuration production
```

The default CLI `build` target writes to:
- `C:/workspace/aemud/projets/App/aemud-api/src/main/resources/static` (see `angular.json` `build.options.outputPath`)

### Docker-based run

To build and run the Nginx-based production image locally:
```bash
docker-compose up --build
```

This exposes the SPA on `http://localhost:80/`.

The `Dockerfile` uses a two-stage build:
- Stage 1: Node image installing dependencies and running `npm run build`
- Stage 2: Nginx serving the built SPA with `default.conf` routing all paths to `index.html` (SPA-style routing)

## High-level architecture

### Angular version and style

- Angular 17 with standalone components at the root (`AppComponent`) and some key layout components.
- TypeScript strict mode is enabled (`tsconfig.json`), with strict Angular template checks.
- Styling uses global SCSS (`src/styles.scss`) plus feature/component-level SCSS; shared SCSS variables and typography are under `src/assets/scss/`.

### Module and routing structure

Project root of the app is `src/app/` and is structured into three main areas:

- `core/`
  - Guards: `auth.guard.ts` checks login state via `SessionService` and redirects to `/login`; `role.guard.ts` enforces role-based access using `AuthService.hasRole(...)` and redirects to `/auth/unauthorized` on failure.
  - HTTP interceptors: `auth.interceptor.ts` injects the `Authorization: Bearer <token>` header for authenticated API calls (excluding a small set of public auth/user endpoints) and logs out on JWT expiration; `error.interceptor.ts` logs 401 errors and routes through `AuthService.logout()`.
  - Models: strongly typed DTOs and response wrappers (e.g. `response-entity-api.ts`, `response-pageable-api.ts`, `member-data.model.ts`, `contribution-data.model.ts`, etc.) mirroring backend domain structures.
  - Services: shared application-level services such as `AppStateService` for global mandat state (see below).

- `shared/`
  - Components: cross-cutting UI elements such as `layout`, `header`, `aside-bare`, confirmation modals, skeleton loaders, notification popover, and validation messages.
  - Services: `SidebarService` (tracks sidebar open/closed state via BehaviorSubject), `NavigationService` (centralized route construction for main domains like members, configurations, contributions, notifications), `GlobalErrorHandlerService` (delegates errors to Sentry), `card-content.service.ts`, and shared auth/navigation helpers.
  - Routes: `shared.routes.ts` defines shared layout routes for home and not-found pages (`NotFoundComponent`).
  - Utilities: shared directives (e.g. `context-menu.directive.ts`) and pipes (`format-key`, `to-date`).

- `features/`
  - Domain-specific feature folders, each with its own routing and services. These are lazy-loaded from `app-routing.ts`:
    - `auth/` — login, signup, password reset/first-connection, change-password, unauthorized pages (`AUTH_ROUTES.ts`).
    - `mandat/` — mandate list/detail/add/edit views with corresponding HTTP services and models.
    - `member/` — member management (search, details, registration, contributions) via HTTP and state services.
    - `configuration/` — configuration management for sessions, clubs, commissions, and related concepts.
    - `contribution/` — contribution creation and listing.
    - `notification/` — message and SMS templates, recipient groups, and notification sending.
    - `user/` — user administration, guarded by `roleGuard` for admin-only routes.

Top-level routing (`app-routing.ts`) defines:
- A root `LayoutComponent` shell protected by `authGuard` that hosts all authenticated child feature routes (`/mandats`, `/members`, `/configurations`, `/contributions`, `/notifications`, `/users`).
- `/auth` lazy module for all authentication-related routes.
- A wildcard redirect to `auth/login` for unknown paths.

### State and layout orchestration

- `LayoutComponent` is the primary shell for authenticated views. On init it:
  - Fetches all mandats via `MandatHttpService`.
  - Stores the list in `AppStateService.mandats$`.
  - Detects the active mandat (`estActif`) and loads its detailed data.
  - Writes the selected mandat (with phases) to `AppStateService.activeMandat$` for other components to consume.
- Sidebar open/closed state is global and reactive via `SidebarService.isOpen$` and `toggleCollapse()`.
- `AppStateService` encapsulates shared mandat-related state using BehaviorSubjects, avoiding heavy global state libraries while still allowing reactive composition across features.

### Environments and feature flags

Environment files (`src/environments/*.ts`) share a common `Environment` interface and provide:
- `name`, `production` flag
- Base URLs: `API_URL` (main AEMUD API), plus `identity_API_URL`, `storage_API_URL`, `users_API_URL`
- A `features` array with runtime feature toggles, currently including a `loggingSystem` configuration (type `Sentry` with DSN) and a placeholder `discount` feature.

Angular CLI configurations in `angular.json` map to these environments:
- `development` build/serve target replaces `environment.ts` with `environment.development.ts` (used by `npm start` / `ng serve`).
- `staging` build uses `environment.staging.ts`.
- `production` build uses `environment.production.ts`.

Sentry integration for global error tracking is wired via `GlobalErrorHandlerService` (custom `ErrorHandler`) and the `loggingSystem` feature configuration.

### Backend integration and deployment topology

- All authenticated API calls target URLs containing `api/` and are decorated with a JWT token by `auth.interceptor.ts` (except a defined list of public auth/user endpoints).
- Production `API_URL` is relative (`/aemud/api/v1`), intended to be served from the same origin as the Spring Boot backend.
- The Angular production build output path in `angular.json` points directly into the backend static resources directory: `C:/workspace/aemud/projets/App/aemud-api/src/main/resources/static`.
- The Docker image produced by this repo is Nginx-based and suitable for standalone SPA hosting, but in the monorepo context you may also rely on the Spring Boot static serving path.

## When extending the app

- Prefer adding new business functionality via feature folders under `src/app/features/`, with their own `*.routes.ts` definitions, HTTP services, and domain models under `core/models` when data is shared.
- For shared UI or utilities used across multiple domains, place components/services/pipes under `src/app/shared/` and wire them into `LayoutComponent` or domain feature modules as appropriate.
- Ensure new routes are either added to existing feature route files or a new lazy-loaded route graph is registered in `app-routing.ts`.

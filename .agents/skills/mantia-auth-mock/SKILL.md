---
name: mantia-auth-mock
description: Mantia's fake client-side auth — session signals, demo login, route guards. Trigger on: auth, login, logout, session, guard, protected route, canActivate, demo credentials, AuthService, authGuard.
---

# Mantia Auth Mock

Fake client-side authentication. No backend, no HTTP — presentational only.

## AuthService (`core/services/auth.service.ts`)

- `user` readonly signal (`User | null`), `isAuthenticated` computed (non-null → true).
- `login(email, password)` → resolves `true` on match, `false` otherwise. Demo: `demo@mantia.app` / `mantia`.
- `register({ empresa, nombre, email, password })` → always succeeds, creates `usr_<timestamp>` id.
- `logout()` → clears signal + localStorage.
- Session persisted at `localStorage['mantia.session']` as JSON. Hydrated on `constructor` with SSR guard (`typeof localStorage !== 'undefined'`).

## authGuard (`core/guards/auth.guard.ts`)

Functional `CanActivateFn`. Returns `true` if authenticated, otherwise redirects to `/login`.

## Route protection (`app.routes.ts`)

Guard is applied on the **parent** `app` route (`path: 'app'`, `canActivate: [authGuard]`). Every child (`dashboard`, `ordenes`, `activos`, `preventivo`, `inventario`, `reportes`, `tecnicos`, `ubicaciones`, `configuracion`) is automatically protected.

**To protect a new page:** add it as a child of the `app` route. Do NOT add `canActivate` per-child.

## Gotchas

- `User` model (`core/models/user.ts`): `{ id, nombre, email, empresa, rol?, iniciales? }` — `rol` is optional and unused by the mock.
- `register` generates a deterministic-ish id (`usr_<Date.now()>`) but never persists a real password.
- `hydrate` silently removes corrupt localStorage entries — don't assume session survives parsing.

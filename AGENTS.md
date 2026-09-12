# AGENTS.md

## Layout

- Root has **no `package.json`**. The only project is `apps/web` (Angular 22 workspace). Run every command from `apps/web`.
- `apps/web/libs/ui/**` is **repo-owned generated code** (Spartan "helm" styles copied in by the CLI). Edit it freely; it is not a dependency.
- `@spartan-ng/brain` primitives live in `node_modules` and are not editable.

## Commands (from `apps/web`)

- `npm start` — dev server (`ng serve`, http://localhost:4200).
- `npm run build` — production build (`ng build`; `defaultConfiguration` is `production`). This is also the typecheck.
- `npm test` — Vitest via `@angular/build:unit-test`. Watch defaults to **on in a TTY**, so pass `--watch=false` in interactive shells. Run one file with `npm test -- --include src/app/app.spec.ts`, or filter by name with `npm test -- --filter '^App'`. (Bare `ng test <path>` fails — it treats the path as a project name.)
- `npm run lint` — ESLint flat config (`eslint.config.js`, angular-eslint 22) over `src/**` and `libs/ui/**`. Generated Helm code uses `hlm-`/`brn-` selectors, so `component-selector`/`directive-selector` are disabled for `libs/ui/**`.
- **No format script.** Formatting is Prettier (`apps/web/.prettierrc`: printWidth 100, single quotes, `angular` parser for `.html`).

## UI stack

- Tailwind CSS v4 via PostCSS (`.postcssrc.json` + `@import 'tailwindcss'`). **Do not add `tailwind.config.ts`** — v4 is CSS-first.
- Spartan UI on top of Angular CDK. Design tokens are semantic oklch vars in `src/styles.css` (`:root` and `:root.dark`); use `bg-background`, `text-foreground`, etc. — never hardcode colors.
- `components.json` (`componentsPath: libs/ui`, `style: vega`, `importAlias: @spartan-ng/helm`) drives the CLI. Note `style` (component variant: vega/nova/…) is separate from the color theme in `styles.css` (currently `neutral`).
- Add components: `npx ng g @spartan-ng/cli:ui <name>` (e.g. `button`). Import with `import { HlmButtonImports } from '@spartan-ng/helm/button'` — the alias is mapped in `tsconfig.json` to `libs/ui/*/src/index.ts`.
- Merge classes with `classes()` / `hlm()` from `@spartan-ng/helm/utils` (wraps clsx + tailwind-merge), not raw string concat.

## Spartan usage rules (enforced by the `spartan` skill)

- **Prefer existing components over custom markup.** Run `ng g @spartan-ng/cli:info --json` and check `installedComponents` / `availableComponents` before building anything.
- **Add via the CLI, then compose:** `npx ng g @spartan-ng/cli:ui --name=<component>` copies Helm code into `libs/ui`; import the exported `*Imports` const. Do not re-add already-installed components.
- **Use built-in `variant`/`size` inputs before overriding classes**, and semantic tokens (`bg-primary`) over raw colors (`bg-blue-500`).
- **Customize by editing the copied Helm files in `libs/ui`; never patch Brain** in `node_modules`. Reach for Brain directly only for behavior Helm/CDK don't cover (see the skill's `rules/brain-vs-helm.md`).
- Verify selectors/APIs against the `spartan-ui` MCP or the skill's `rules/` — never guess.

## Icons

- Use `@ng-icons/core` + `@ng-icons/lucide`. Register in `app.config.ts` via `provideIcons({ lucidePlus, ... })`, then `<ng-icon name="lucidePlus" />`.
- **Do not add `lucide-angular`** — its peer range (Angular 13–21) excludes Angular 22. `@ng-icons/*` v36 supports Angular 22 and is what Spartan's helm uses internally.

## Project skills & MCP

- Project skills live in `.agents/skills/` (`spartan`, `frontend-design`, `tailwind-v4-shadcn`, `angular-developer`). The `spartan` skill auto-activates on repos with `components.json`; prefer it for any Spartan work.
- `tailwind-v4-shadcn` is React/Vite-oriented — only reuse its Tailwind v4 CSS architecture patterns (CSS vars, `@theme inline`, `@plugin`), not its React/Vite steps.
- The official `spartan-ui` MCP is configured in root `opencode.json` (`npx -y @spartan-ng/mcp`). Use it to fetch up-to-date component APIs. Config is loaded only at startup — restart opencode after changing it.

## Known gotchas

- `npm audit` reports 7 high dev-only vulns from `@spartan-ng/cli` (Nx → smol-toml DoS). No fix without a major Nx bump; do not force-fix.
- `src/app/app.html` is still the Angular CLI placeholder — replace it when building real UI.
- `app.routes.ts` is empty; there is no routing configured yet.

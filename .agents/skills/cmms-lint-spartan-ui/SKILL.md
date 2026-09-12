---
name: cmms-lint-spartan-ui
description: >-
  Use when running/fixing ESLint in this repo, editing apps/web/eslint.config.js,
  adding or updating Spartan Helm components under apps/web/libs/ui/**, or when
  lint reports no-input-rename / accessibility errors in libs/ui. Keywords: lint,
  eslint, eslint.config.js, libs/ui, spartan, helm, no-input-rename,
  interactive-supports-focus, click-events-have-key-events.
---

# Lint & Spartan Helm UI — CMMS

Angular 22 workspace at `apps/web`. ESLint flat config in `apps/web/eslint.config.js`. All commands run from `apps/web`.

## Key fact

Essentially all lint violations live in the generated Spartan Helm code under `libs/ui/**`; hand-written `src/**` is normally clean. **When lint fails, check `libs/ui/**` first.**

## Commands (from `apps/web`)

| What | Command |
|---|---|
| Full lint | `npm run lint` (calls `ng lint`) |
| Targeted fix (Helm TS only) | `npx eslint "libs/ui/**/*.ts" --fix` |
| Full fix (all files) | `npx eslint "src/**" "libs/ui/**" --fix` |
| Typecheck / verify | `npm run build` |

There is no format script. Prettier config: `printWidth 100`, `single quotes`, `angular` parser for `.html`.

## `eslint.config.js` — the `libs/ui/**/*.ts` override

The config has a dedicated block for `libs/ui/**/*.ts` that turns **OFF** three rules:

```js
// Generated Helm components follow spartan's own `hlm-`/`brn-` selector conventions
// and intentionally alias inputs (class, style, checked, etc.) for standard Angular bindings.
files: ['libs/ui/**/*.ts'],
rules: {
  '@angular-eslint/directive-selector': 'off',
  '@angular-eslint/component-selector': 'off',
  '@angular-eslint/no-input-rename': 'off',
},
```

### Why each rule is disabled

- **`directive-selector` / `component-selector`**: Helm uses `hlm-`/`brn-` prefixes, not the project's `app` prefix. Renaming selectors would break the component API.
- **`no-input-rename`**: Helm components intentionally alias inputs (`class`, `style`, `checked`, `tabListClass`) to support standard Angular bindings. Renaming them would break the component API. **Always disable via config — never rename the inputs.**

## Accessibility policy

`@angular-eslint/template/interactive-supports-focus` and `click-events-have-key-events` are **NOT** disabled for `libs/ui/**`. Fix them properly in the component template:

- Add `role`, `tabindex`, and keyboard handlers (Enter/Space)
- Or use a native interactive element (`<button>`, `<a>`)
- **Never** add `eslint-disable` comments

### Precedent files

- `hlm-numbered-pagination.ts`: `role="button"` / `tabindex` / `keydown` on prev/next and page links
- `hlm-tabs-paginated-list.ts`: `tabindex="0"` on the keydown container

## Auto-fixable rules that recur

These appear in `libs/ui/**` and can be resolved with `--fix`:

| Rule | What changes |
|---|---|
| `@typescript-eslint/consistent-type-definitions` | `type` → `interface` |
| `@typescript-eslint/array-type` | `ReadonlyArray<T>` → `readonly T[]` |
| Stale `eslint-disable` directives | Unused because the rule is already disabled config-wide for `libs/ui/**` |

## Quirk / pitfall

`libs/ui/**` is **repo-owned generated code**. It is fine to edit, but manual edits (e.g. a11y fixes) may be overwritten if the component is regenerated with the Spartan CLI (`npx ng g @spartan-ng/cli:ui <name>`). Prefer config overrides for rules that conflict with generated patterns, and re-check lint after regenerating.

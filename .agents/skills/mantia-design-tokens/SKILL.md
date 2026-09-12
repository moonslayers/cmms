---
name: mantia-design-tokens
description: Mantia's visual identity, oklch tokens, dark mode, and font rules. Trigger on: colors, theme, dark mode, tokens, oklch, primary, accent, success, warning, destructive, font, IBM Plex, styles.css, ThemeService, radius, density.
---

# Mantia Design Tokens

Semantic oklch tokens in `src/styles.css`. Tailwind v4 CSS-first — no `tailwind.config.ts`.

## Identity tokens (`:root`)

| Token | Light | Dark | Role |
|---|---|---|---|
| `--primary` | `oklch(0.48 0.09 245)` | `oklch(0.58 0.10 245)` | Steel-blue |
| `--accent` | `oklch(0.78 0.15 75)` | `oklch(0.82 0.16 75)` | Amber |
| `--success` | `oklch(0.62 0.17 155)` | `oklch(0.65 0.18 155)` | Green |
| `--warning` | `oklch(0.75 0.15 75)` | `oklch(0.80 0.16 75)` | Amber-orange |
| `--destructive` | `oklch(0.58 0.22 25)` | `oklch(0.65 0.22 25)` | Red |

Plus `--secondary`, `--muted`, `--card`, `--border`, `--input`, `--ring`, `--popover`, sidebar tokens (`--sidebar`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`), and 5 chart tokens. `--radius: 0.625rem`.

## Fonts (Tailwind v4 `@theme`)

- `--font-sans`: IBM Plex Sans (+ system fallbacks)
- `--font-mono`: IBM Plex Mono (+ system fallbacks)
- Loaded via Google Fonts in `index.html`.
- Use `font-sans` / `font-mono` in templates.

## Dark mode

- Toggled by adding/removing `dark` class on `<html>`.
- `ThemeService` (`core/services/theme.service.ts`): `toggleTheme()`, `setTheme(dark: boolean)`, `isDark` signal.
- Persisted at `localStorage['mantia.theme']` (`'dark'` | `'light'`).

## Rules

- Use semantic tokens only: `bg-primary`, `text-muted-foreground`, `bg-success`, `text-warning`, `text-destructive`, `border-border`.
- **NEVER** raw colors: `bg-blue-500`, `text-emerald-600`, etc.

## Extras

- `@keyframes fadeIn` with `prefers-reduced-motion: reduce` guard (disables animation).
- Density utilities: `.density-compact` (tight spacing) and `.density-comfortable` (loose spacing) applied as wrapper classes.

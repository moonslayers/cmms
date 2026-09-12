---
name: mantia-shared-ui
description: >-
  Using the Mantia shared presentational component library. Trigger when creating
  or editing feature pages, composing dashboards, building tables with
  DataTable, using StatCard/PageHeader/StatusBadge/charts, or following the
  PageHeader → KPIs → filters → table page pattern.
---

# Mantia Shared UI Components

All components live under `apps/web/src/app/shared/components/<name>/` with an `index.ts` barrel. Import from the barrel: `import { PageHeaderComponent } from '../../shared/components/page-header'`.

All components are **standalone** with **OnPush** change detection. Use semantic Tailwind tokens (`bg-primary`, `text-muted-foreground`), never hardcoded colors.

## Component APIs

### PageHeaderComponent
`title` (required string), `subtitle?` (string), `breadcrumbs?` (`{ label: string; link?: string }[]`). Has a named `[actions]` content slot (right side of the header row). Breadcrumb root crumb should point to `/app/dashboard`.

### StatCardComponent
`label` (required), `value` (required string|number), `hint?` (string), `trend?` (`'up' | 'down' | 'flat'`), `delta?` (string), `icon?` (string — icon name). Renders trend arrow and color via computed signals.

### StatusBadgeComponent
`status` (required string), `kind?` (`'work-order' | 'priority' | 'asset' | 'stock' | 'generic'`, default `'generic'`). Maps status strings to badge variants and colored dots. Status values use snake_case (e.g. `en_progreso`).

### EmptyStateComponent
`title` (required), `description?`, `icon?` (icon name). Has a default content slot.

### SectionCardComponent
`title` (required), `description?`. Two named slots: `[actions]` (top-right of header) and `[body]` (card content area).

### SearchInputComponent
`value` (model<string>, two-way bindable), `placeholder?` (default `'Buscar...'`). Emits via `value` signal model.

### Charts (custom inline SVG — no charting library)

- **BarChartComponent**: `data` (`{ label: string; value: number }[]`, required), `height?` (default 220), `ariaLabel?`
- **LineChartComponent**: `data` (`{ label: string; value: number }[]`, required), `height?` (default 220), `ariaLabel?`
- **DonutChartComponent**: `data` (`{ label: string; value: number; color?: string }[]`, required), `size?` (default 180), `ariaLabel?`

DonutChart auto-assigns colors from CSS custom properties (`--primary`, `--chart-1`..`--chart-5`) when `color` is omitted.

### DataTableComponent
`columns` (required `TableColumn[]`), `rows` (`Record<string, unknown>[]`), `pageSize?` (default 8), `searchable?` (default true), `searchPlaceholder?` (default `'Buscar...'`).

`TableColumn`: `{ key: string; label: string; align?: 'left' | 'center' | 'right'; type?: 'text' | 'number' | 'status' | 'mono' }`.

When `type: 'status'`, the cell renders a `StatusBadgeComponent` automatically. Uses a default `<ng-content />` slot at the top (alongside the search input) for filter buttons or extra toolbar content. Handles pagination and client-side search internally.

## Page composition pattern

Reference: `apps/web/src/app/features/work-orders/work-orders.ts`

Standard structure:
1. `<app-page-header>` with title, breadcrumbs, action button(s)
2. Row of `<app-stat-card>` KPIs
3. Filter controls (dropdowns, `<app-search-input>`)
4. `<app-section-card>` wrapping an `<app-data-table>`

Breadcrumbs typically: `[{ label: 'Dashboard', link: '/app/dashboard' }, { label: 'Page Title' }]`.

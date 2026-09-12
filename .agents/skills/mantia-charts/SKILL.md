---
name: mantia-charts
description: >-
  Mantia's custom inline SVG chart system (no charting library). Trigger when
  creating, editing, or debugging charts (bar, line, donut), SVG tooltips,
  chart animations, formatChartValue, resolveChartPalette, ChartTooltipContentComponent,
  BarChartComponent, LineChartComponent, DonutChartComponent, donut arc math,
  or reduced-motion guards for charts.
---

# Mantia Charts System

Custom inline SVG charts — no chart.js / d3 / echarts. All components are standalone, OnPush.

## File layout

```
src/app/shared/components/
├── charts/                          ← shared layer
│   ├── chart.types.ts               ← DonutDataPoint, ChartValueFormat
│   ├── chart.utils.ts               ← formatChartValue, resolveChartPalette, prefersReducedMotion
│   ├── index.ts                     ← barrel re-exports
│   └── chart-tooltip/
│       ├── chart-tooltip-content.component.ts
│       └── index.ts
├── bar-chart/
│   ├── bar-chart.component.ts       ← BarChartComponent
│   ├── bar-chart.component.html
│   └── index.ts
├── line-chart/
│   ├── line-chart.component.ts      ← LineChartComponent
│   ├── line-chart.component.html
│   └── index.ts
└── donut-chart/
    ├── donut-chart.component.ts     ← DonutChartComponent
    ├── donut-chart.component.html
    └── index.ts
```

Consumers: `src/app/features/dashboard/`, `src/app/features/reports/`.

## Shared API

### `formatChartValue(value: number, format: ChartValueFormat): string`

Formats values using `Intl.NumberFormat('es-MX')`. Returns locale-formatted strings.

### `resolveChartPalette(): string[]`

Reads `--chart-1`…`--chart-5` CSS vars from `:root` (oklch tokens in `styles.css`). SSR fallback to hardcoded oklch values. **Never hardcode chart colors** — always use this function.

### `prefersReducedMotion(): boolean`

Checks `window.matchMedia('(prefers-reduced-motion: reduce)')`. SSR-safe (returns `false`).

### Types

| Type | Shape |
|------|-------|
| `ChartValueFormat` | `'number' \| 'currency' \| 'percent' \| 'compact'` |
| `DonutDataPoint` | `{ label: string; value: number; color?: string }` |
| `ChartDataPoint` (bar) | `{ label: string; value: number }` |
| `LineChartDataPoint` | `{ label: string; value: number }` |

## Component APIs

### BarChartComponent

| Input | Type | Default | Notes |
|-------|------|---------|-------|
| `data` | `ChartDataPoint[]` | **required** | |
| `height` | `number` | `220` | px |
| `ariaLabel` | `string` | auto (`Gráfico de barras con N elementos`) | |
| `valueFormat` | `ChartValueFormat` | `'number'` | |
| `showValues` | `boolean` | `false` | Renders `<text>` above bars |
| `animate` | `boolean` | `true` | `bar-grow` CSS animation |

Selector: `app-bar-chart`. Host class: `block w-full touch-manipulation`.

### LineChartComponent

| Input | Type | Default | Notes |
|-------|------|---------|-------|
| `data` | `LineChartDataPoint[]` | **required** | |
| `height` | `number` | `220` | px |
| `ariaLabel` | `string` | `'Gráfico de líneas'` | |
| `valueFormat` | `ChartValueFormat` | `'number'` | |
| `showValues` | `boolean` | `true` | Renders `<text>` above points |
| `animate` | `boolean` | `true` | stroke-dashoffset draw animation |

Selector: `app-line-chart`. Host class: `block w-full`. Fixed `svgWidth = 500` (viewBox). Padding: `{ top: 20, right: 16, bottom: 30, left: 40 }`.

### DonutChartComponent

| Input | Type | Default | Notes |
|-------|------|---------|-------|
| `data` | `DonutDataPoint[]` | **required** | `color` auto-assigned from palette |
| `size` | `number` | `180` | SVG viewBox square |
| `ariaLabel` | `string` | `'Gráfico de dona'` | |
| `valueFormat` | `ChartValueFormat` | `'number'` | |
| `showTotal` | `boolean` | `true` | Center label: formatted total + "Total" |
| `animate` | `boolean` | `true` | `donut-reveal` animation with staggered delays |

Selector: `app-donut-chart`. Host class: `block`. Includes inline legend.

## Tooltip pattern (CRITICAL)

All 3 charts use the same pattern built on **Spartan HlmTooltip** (`@spartan-ng/helm/tooltip`) which wraps **BrnTooltip** → Angular CDK Overlay.

### Setup per chart

```ts
// In @Component decorator:
providers: [provideBrnTooltipGroup({ skipDelayDuration: 300 })],
imports: [HlmTooltipImports, ChartTooltipContentComponent],
```

`provideSpartanHlm()` must be in `app.config.ts` (configures CDK overlay defaults).

### `ChartTooltipContentComponent`

Inputs: `label` (required string), `value` (required string), `color` (optional string). Renders colored dot + label + value.

### QUIRK: BrnTooltip does NOT pass context

`BrnTooltip`/`BrnTooltipContent` has **no context input**. `<ng-template let-x>` anchored to `[hlmTooltip]` receives `x = undefined` → runtime error (`can't access property "label", ... undefined`).

### WORKAROUND: signal → computed → @if guard

Every chart uses this pattern:

```ts
// In .ts
readonly activeIndex = signal<number | null>(null);
readonly activeTooltipData = computed(() => {
  const idx = this.activeIndex();
  const items = this.computedData();
  if (idx === null || idx < 0 || idx >= items.length) return null;
  return { label: items[idx].label, formattedValue: items[idx].formattedValue, color: items[idx].color };
});
// Methods: onBarEnter(i), onBarLeave(), onBarFocus(i), onBarBlur()
```

```html
<!-- In .html — NO let- bindings, reads signal directly -->
<ng-template #pointTooltip>
  @if (activeTooltipData(); as data) {
    <app-chart-tooltip-content
      [label]="data.label"
      [value]="data.formattedValue"
      [color]="data.color"
    />
  }
</ng-template>
```

SVG elements anchor with `[hlmTooltip]="pointTooltip"` (ref name, not `let-`).

## Reduced-motion pattern

Every chart uses:

```ts
readonly reducedMotion = computed(() => prefersReducedMotion());
```

Combined with CSS:

```css
@media (prefers-reduced-motion: reduce) {
  /* disable specific animation class */
}
```

Guard in template: `[class.bar-grow]="animate() && !reducedMotion()"` (bar), `[class.donut-segment-animate]="animate() && !reducedMotion()"` (donut).

### Line chart dashoffset bug

Line chart uses `stroke-dasharray` / `stroke-dashoffset` for draw animation. `dashStyle` computed returns `{ dasharray: 'none', dashoffset: '0' }` when `animated === false`. **Do NOT set a large `dashoffset` value when animation is off** — it will hide the line completely (the path appears invisible because dashoffset = dasharray length).

## Accessibility

All charts use:

- `role="img"` on the `<svg>` element
- `aria-label` on `<svg>` (from `ariaLabel` input or auto-generated)
- `<title>` and `<desc>` child elements inside SVG
- Data elements (`<rect>`, `<circle>`, `<path>`) with `tabindex="0"`, `role="graphics-symbol"` or `role="button"`, and `aria-label` showing formatted value
- `focus-visible:outline-*` CSS classes for keyboard focus ring
- Hover/focus handlers (`mouseenter`/`mouseleave`/`focus`/`blur`) update `activeIndex` signal

## Gotchas

| Gotcha | Detail |
|--------|--------|
| **Donut full circle** | `delta >= 359.99` requires splitting into two arcs (mid ± 0.01°) to avoid SVG artifact. Implemented in `describeArc()`. |
| **Grid labels must use `formatChartValue`** | Line chart Y-axis labels and bar chart gridlines use `formatChartValue(val, valueFormat())` for consistency. Never display raw numbers. |
| **X-axis label rotation** | Bar chart rotates labels at -40° when `data.length >= 8` (via `labelTransform` computed). |
| **Palette from tokens only** | Always use `resolveChartPalette()`. Colors come from `--chart-1`..`--chart-5` CSS vars (oklch in `styles.css`). Never hardcode chart colors. |
| **No charting library** | Do not add chart.js, d3, echarts, or any charting package. All rendering is inline SVG. |
| **Donut color auto-assign** | `DonutDataPoint.color` is optional; missing colors are assigned from palette by index: `palette[i % palette.length]`. |
| **Tooltip index scoping** | Each chart instance has its own `activeIndex` signal — no shared state between chart instances. |
| **SVG viewBox** | Bar chart uses dynamic viewBox (`chartWidth × height`). Line chart uses fixed `500 × height`. Donut uses `size × size`. |

## Import paths

```ts
// From any feature component
import { BarChartComponent } from '../../shared/components/bar-chart';
import { LineChartComponent } from '../../shared/components/line-chart';
import { DonutChartComponent } from '../../shared/components/donut-chart';

// Shared utils
import { formatChartValue, resolveChartPalette, prefersReducedMotion } from '../../shared/components/charts';
import type { ChartValueFormat, DonutDataPoint } from '../../shared/components/charts';
import { ChartTooltipContentComponent } from '../../shared/components/charts/chart-tooltip';

// Spartan tooltip (already installed)
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { provideBrnTooltipGroup } from '@spartan-ng/brain/tooltip';
```

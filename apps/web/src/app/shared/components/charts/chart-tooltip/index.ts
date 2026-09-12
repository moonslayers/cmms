export { ChartTooltipContentComponent } from './chart-tooltip-content.component';

/**
 * Chart Tooltip Pattern — Reusable `[hlmTooltip]` for inline SVG charts
 *
 * Prerequisites:
 *   - `provideSpartanHlm()` in app config (configures CDK overlay defaults).
 *   - `HlmTooltip` installed (already present in `libs/ui/tooltip`).
 *
 * Setup per chart component (bar-chart, line-chart, donut-chart):
 *
 *   1. Import the content component and tooltip directive:
 *
 *      import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
 *      import { provideBrnTooltipGroup } from '@spartan-ng/brain/tooltip';
 *      import { ChartTooltipContentComponent } from '../chart-tooltip';
 *
 *   2. Add providers for grouped hover (skipDelay makes pointer travel
 *      between data points/bars/segments feel instant):
 *
 *      @Component({
 *        providers: [provideBrnTooltipGroup({ skipDelayDuration: 300 })],
 *        imports: [HlmTooltipImports, ChartTooltipContentComponent],
 *        ...
 *      })
 *
 *   3. Anchor `[hlmTooltip]` on each SVG data element (rect, circle, path, etc.)
 *      and pass a `<ng-template>` as the tooltip content:
 *
 *      <svg>
 *        @for (point of data(); track point.label) {
 *          <rect
 *            [hlmTooltip]="pointTooltip"
 *            position="top"
 *            [showDelay]="100"
 *            [hideDelay]="0"
 *            [attr.x]="..."
 *            [attr.y]="..."
 *            [attr.width]="..."
 *            [attr.height]="..."
 *          />
 *        }
 *      </svg>
 *
 *      <ng-template #pointTooltip let-point>
 *        <app-chart-tooltip-content
 *          [label]="point.label"
 *          [value]="point.formattedValue"
 *          [color]="point.color"
 *        />
 *      </ng-template>
 *
 * SVG compatibility:
 *   BrnTooltip uses Angular CDK OverlayPositionBuilder.flexibleConnectedTo(),
 *   which reads the host element's getBoundingClientRect(). SVG elements
 *   (rect, circle, path, g) implement this natively — no adapter needed.
 *   The tooltip content renders in a CDK overlay pane in the document body,
 *   so it is always standard HTML regardless of the trigger element type.
 */

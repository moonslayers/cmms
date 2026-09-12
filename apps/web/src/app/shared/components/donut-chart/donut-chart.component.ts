import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { provideBrnTooltipGroup } from '@spartan-ng/brain/tooltip';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import {
  type ChartValueFormat,
  type DonutDataPoint,
  formatChartValue,
  prefersReducedMotion,
  resolveChartPalette,
} from '../charts';
import { ChartTooltipContentComponent } from '../charts/chart-tooltip';

export type { DonutDataPoint };

@Component({
  selector: 'app-donut-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  providers: [provideBrnTooltipGroup({ skipDelayDuration: 300 })],
  imports: [HlmTooltipImports, ChartTooltipContentComponent],
  templateUrl: './donut-chart.component.html',
  styles: `
    @keyframes donut-reveal {
      from {
        stroke-dashoffset: var(--donut-length, 300);
        opacity: 0;
      }
      to {
        stroke-dashoffset: 0;
        opacity: 1;
      }
    }

    .donut-segment-animate {
      animation: donut-reveal 0.6s ease-out var(--donut-delay, 0ms) both;
    }

    @media (prefers-reduced-motion: reduce) {
      .donut-segment-animate {
        animation: none;
      }
    }
  `,
})
export class DonutChartComponent {
  data = input.required<DonutDataPoint[]>();
  size = input<number>(180);
  ariaLabel = input<string>();
  valueFormat = input<ChartValueFormat>('number');
  showTotal = input<boolean>(true);
  animate = input<boolean>(true);

  readonly activeIndex = signal<number | null>(null);

  readonly activeTooltipData = computed(() => {
    const idx = this.activeIndex();
    const segs = this.segments();
    if (idx === null || idx < 0 || idx >= segs.length) return null;
    const seg = segs[idx];
    return { label: seg.label, formattedValue: seg.formattedValue, color: seg.color };
  });

  private readonly palette = computed(() => resolveChartPalette());

  total = computed(() => this.data().reduce((sum, d) => sum + d.value, 0));

  formattedTotal = computed(() => formatChartValue(this.total(), this.valueFormat()));

  segments = computed(() => {
    const d = this.data();
    const t = this.total();
    const p = this.palette();
    if (t === 0) return [];
    let cum = 0;
    return d.map((pt, i) => {
      const pct = pt.value / t;
      const start = cum;
      cum += pct;
      return {
        ...pt,
        pct,
        startAngle: start * 360 - 90,
        endAngle: cum * 360 - 90,
        color: pt.color ?? p[i % p.length],
        formattedValue: formatChartValue(pt.value, this.valueFormat()),
      };
    });
  });

  legendItems = computed(() => {
    const t = this.total();
    const p = this.palette();
    return this.data().map((pt, i) => ({
      ...pt,
      percentage: t > 0 ? Math.round((pt.value / t) * 100) : 0,
      color: pt.color ?? p[i % p.length],
      formattedValue: formatChartValue(pt.value, this.valueFormat()),
    }));
  });

  readonly reducedMotion = computed(() => prefersReducedMotion());

  describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
    const delta = endAngle - startAngle;
    if (delta >= 359.99) {
      const mid = startAngle + 180;
      const p1 = this.polarToCartesian(cx, cy, r, startAngle);
      const p2 = this.polarToCartesian(cx, cy, r, mid - 0.01);
      const p3 = this.polarToCartesian(cx, cy, r, mid);
      const p4 = this.polarToCartesian(cx, cy, r, endAngle - 0.01);
      return [
        `M ${p1.x} ${p1.y}`,
        `A ${r} ${r} 0 1 1 ${p2.x} ${p2.y}`,
        `A ${r} ${r} 0 1 1 ${p3.x} ${p3.y}`,
        `A ${r} ${r} 0 1 1 ${p4.x} ${p4.y}`,
      ].join(' ');
    }
    const start = this.polarToCartesian(cx, cy, r, endAngle);
    const end = this.polarToCartesian(cx, cy, r, startAngle);
    const largeArc = delta > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  }

  private polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  onEnter(index: number): void {
    this.activeIndex.set(index);
  }

  onLeave(): void {
    this.activeIndex.set(null);
  }
}

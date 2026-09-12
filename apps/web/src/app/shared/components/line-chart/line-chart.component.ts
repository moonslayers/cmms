import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { afterNextRender } from '@angular/core';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { provideBrnTooltipGroup } from '@spartan-ng/brain/tooltip';
import { ChartTooltipContentComponent } from '../charts/chart-tooltip';
import { formatChartValue, prefersReducedMotion } from '../charts';
import type { ChartValueFormat } from '../charts';

export interface LineChartDataPoint {
  label: string;
  value: number;
}

let nextId = 0;

@Component({
  selector: 'app-line-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
  providers: [provideBrnTooltipGroup({ skipDelayDuration: 300 })],
  imports: [HlmTooltipImports, ChartTooltipContentComponent],
  templateUrl: './line-chart.component.html',
  styles: [
    `
      @media (prefers-reduced-motion: reduce) {
        .line-path-transition {
          transition: none !important;
        }
        .point-transition {
          transition: none !important;
        }
      }
    `,
  ],
})
export class LineChartComponent {
  readonly gradientId = `line-area-fill-${nextId++}`;
  readonly uniqueId = `line-chart-${nextId}`;

  readonly pathRef = viewChild<ElementRef<SVGPathElement>>('pathRef');

  protected readonly formatValue = formatChartValue;

  readonly data = input.required<LineChartDataPoint[]>();
  readonly height = input<number>(220);
  readonly ariaLabel = input<string>();
  readonly valueFormat = input<ChartValueFormat>('number');
  readonly showValues = input<boolean>(true);
  readonly animate = input<boolean>(true);

  protected readonly padding = { top: 20, right: 16, bottom: 30, left: 40 };
  protected readonly svgWidth = 500;

  readonly activeIndex = signal<number | null>(null);
  readonly pathLen = signal(0);
  readonly animated = signal(false);

  readonly reducedMotion = computed(() => prefersReducedMotion());

  constructor() {
    afterNextRender(() => {
      const el = this.pathRef()?.nativeElement;
      if (el && typeof el.getTotalLength === 'function') {
        requestAnimationFrame(() => {
          const len = el.getTotalLength();
          this.pathLen.set(len);
          if (!this.reducedMotion() && this.animate()) {
            this.animated.set(true);
          }
        });
      }
    });
  }

  readonly maxValue = computed(() => {
    const vals = this.data().map((d) => d.value);
    return Math.max(...vals, 1);
  });

  readonly gridLines = computed(() => {
    const max = this.maxValue();
    const steps = 4;
    const lines: number[] = [];
    for (let i = 0; i <= steps; i++) {
      lines.push(Math.round((max / steps) * i));
    }
    return lines;
  });

  readonly formattedPoints = computed(() => {
    const pts = this.data();
    if (pts.length === 0) return [];
    const max = this.maxValue();
    const h = this.height();
    const p = this.padding;
    const plotW = this.svgWidth - p.left - p.right;
    const plotH = h - p.top - p.bottom;
    const stepX = pts.length > 1 ? plotW / (pts.length - 1) : plotW / 2;

    return pts.map((pt, i) => ({
      x: p.left + (pts.length > 1 ? i * stepX : plotW / 2),
      y: p.top + plotH - (pt.value / max) * plotH,
      label: pt.label,
      value: pt.value,
      formattedValue: formatChartValue(pt.value, this.valueFormat()),
    }));
  });

  readonly labelPositions = computed(() => {
    const pts = this.data();
    if (pts.length === 0) return [];
    const p = this.padding;
    const plotW = this.svgWidth - p.left - p.right;
    const stepX = pts.length > 1 ? plotW / (pts.length - 1) : plotW / 2;

    return pts.map((pt, i) => ({
      x: p.left + (pts.length > 1 ? i * stepX : plotW / 2),
      label: pt.label,
    }));
  });

  readonly pathD = computed(() => {
    const pts = this.formattedPoints();
    if (pts.length === 0) return '';
    return pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
  });

  readonly areaD = computed(() => {
    const pts = this.formattedPoints();
    if (pts.length === 0) return '';
    const line = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
    const lastX = pts[pts.length - 1].x;
    const firstX = pts[0].x;
    const bottom = this.padding.top + (this.height() - this.padding.top - this.padding.bottom);
    return `${line} L ${lastX} ${bottom} L ${firstX} ${bottom} Z`;
  });

  readonly activePoint = computed(() => {
    const idx = this.activeIndex();
    const pts = this.formattedPoints();
    if (idx === null || idx < 0 || idx >= pts.length) return null;
    return pts[idx];
  });

  readonly activeTooltipData = computed(() => {
    const pt = this.activePoint();
    if (!pt) return null;
    return { label: pt.label, formattedValue: pt.formattedValue, color: 'var(--primary)' };
  });

  readonly dashStyle = computed(() => {
    if (!this.animated()) return { dasharray: 'none', dashoffset: '0' };
    const len = this.pathLen();
    if (!len) return { dasharray: 'none', dashoffset: '0' };
    return {
      dasharray: `${len} ${len}`,
      dashoffset: '0',
    };
  });

  readonly empty = computed(() => this.data().length === 0);

  onPointEnter(index: number): void {
    this.activeIndex.set(index);
  }

  onPointLeave(): void {
    this.activeIndex.set(null);
  }

  onPointFocus(index: number): void {
    this.activeIndex.set(index);
  }

  onPointBlur(): void {
    this.activeIndex.set(null);
  }
}

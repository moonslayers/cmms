import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { provideBrnTooltipGroup } from '@spartan-ng/brain/tooltip';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import {
  type ChartValueFormat,
  ChartTooltipContentComponent,
  formatChartValue,
  prefersReducedMotion,
  resolveChartPalette,
} from '../charts';

export interface ChartDataPoint {
  label: string;
  value: number;
}

@Component({
  selector: 'app-bar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full touch-manipulation' },
  providers: [provideBrnTooltipGroup({ skipDelayDuration: 300 })],
  imports: [HlmTooltipImports, ChartTooltipContentComponent],
  templateUrl: './bar-chart.component.html',
  styles: [
    `
      @keyframes bar-grow {
        from {
          transform: scaleY(0);
        }
        to {
          transform: scaleY(1);
        }
      }

      .bar-grow {
        animation: bar-grow 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      @media (prefers-reduced-motion: reduce) {
        .bar-grow {
          animation: none;
        }
      }
    `,
  ],
})
export class BarChartComponent {
  data = input.required<ChartDataPoint[]>();
  height = input<number>(220);
  ariaLabel = input<string>();
  valueFormat = input<ChartValueFormat>('number');
  showValues = input<boolean>(false);
  animate = input<boolean>(true);

  private readonly palette = computed(() => resolveChartPalette());

  readonly reducedMotion = computed(() => prefersReducedMotion());

  readonly isEmpty = computed(() => this.data().length === 0);

  readonly maxValue = computed(() => {
    const vals = this.data().map((d) => d.value);
    return Math.max(...vals, 1);
  });

  readonly chartWidth = computed(() => this.data().length * 50);

  readonly barData = computed(() => {
    const max = this.maxValue();
    const palette = this.palette();
    const format = this.valueFormat();
    const h = this.height();
    const count = this.data().length;
    const w = this.chartWidth();
    const chartH = h - 30;
    const spacing = w / count;
    const barW = Math.min(spacing * 0.6, 40);
    const rotate = count >= 8;

    return this.data().map((d, i) => {
      const cx = i * spacing + spacing / 2;
      const barH = (d.value / max) * chartH;
      const labelTransform = rotate
        ? `rotate(-40 ${cx} ${h - 10})`
        : null;

      return {
        ...d,
        x: cx - barW / 2,
        y: chartH - barH,
        barW,
        barH,
        labelX: cx,
        transformOrigin: `${cx}px ${chartH}px`,
        labelTransform,
        textAnchor: rotate ? 'end' as const : 'middle' as const,
        formattedValue: formatChartValue(d.value, format),
        color: palette[i % palette.length],
      };
    });
  });

  readonly gridlines = computed(() => {
    const max = this.maxValue();
    const count = 4;
    const chartH = this.height() - 30;
    const lines: { y: number; value: string }[] = [];
    for (let i = 1; i <= count; i++) {
      const ratio = i / (count + 1);
      lines.push({
        y: chartH * (1 - ratio),
        value: formatChartValue(max * ratio, this.valueFormat()),
      });
    }
    return lines;
  });

  readonly chartTitle = computed(() => {
    const label = this.ariaLabel();
    if (label) return label;
    const count = this.data().length;
    return count === 0
      ? 'Gráfico de barras sin datos'
      : `Gráfico de barras con ${count} elementos`;
  });

  readonly activeIndex = signal<number | null>(null);

  readonly activeTooltipData = computed(() => {
    const idx = this.activeIndex();
    const bars = this.barData();
    if (idx === null || idx < 0 || idx >= bars.length) return null;
    const bar = bars[idx];
    return { label: bar.label, formattedValue: bar.formattedValue, color: bar.color };
  });

  onBarEnter(index: number): void {
    this.activeIndex.set(index);
  }

  onBarLeave(): void {
    this.activeIndex.set(null);
  }

  onBarFocus(index: number): void {
    this.activeIndex.set(index);
  }

  onBarBlur(): void {
    this.activeIndex.set(null);
  }
}

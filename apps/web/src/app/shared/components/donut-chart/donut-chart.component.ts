import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface DonutDataPoint {
  label: string;
  value: number;
  color?: string;
}

@Component({
  selector: 'app-donut-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './donut-chart.component.html',
})
export class DonutChartComponent {
  data = input.required<DonutDataPoint[]>();
  size = input<number>(180);
  ariaLabel = input<string>();

  private readonly COLORS = [
    'var(--primary)',
    'var(--chart-1, oklch(0.65 0.15 250))',
    'var(--chart-2, oklch(0.7 0.12 160))',
    'var(--chart-3, oklch(0.6 0.18 30))',
    'var(--chart-4, oklch(0.55 0.14 280))',
    'var(--chart-5, oklch(0.75 0.1 80))',
  ];

  total = computed(() => this.data().reduce((sum, d) => sum + d.value, 0));

  segments = computed(() => {
    const d = this.data();
    const t = this.total();
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
        color: pt.color ?? this.COLORS[i % this.COLORS.length],
      };
    });
  });

  legendItems = computed(() => {
    const t = this.total();
    return this.data().map((pt, i) => ({
      ...pt,
      percentage: t > 0 ? Math.round((pt.value / t) * 100) : 0,
      color: pt.color ?? this.COLORS[i % this.COLORS.length],
    }));
  });

  describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
    const start = this.polarToCartesian(cx, cy, r, endAngle);
    const end = this.polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  }

  private polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
}

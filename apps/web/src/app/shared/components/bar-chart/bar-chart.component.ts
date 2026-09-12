import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface ChartDataPoint {
  label: string;
  value: number;
}

@Component({
  selector: 'app-bar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
  templateUrl: './bar-chart.component.html',
})
export class BarChartComponent {
  data = input.required<ChartDataPoint[]>();
  height = input<number>(220);
  ariaLabel = input<string>();

  maxValue = computed(() => {
    const vals = this.data().map((d) => d.value);
    return Math.max(...vals, 1);
  });

  bars = computed(() => {
    const max = this.maxValue();
    return this.data().map((d) => ({
      ...d,
      heightPercent: (d.value / max) * 100,
    }));
  });

  barWidth = computed(() => {
    const count = this.data().length;
    if (count === 0) return 0;
    return Math.min(100 / count * 0.7, 40);
  });
}

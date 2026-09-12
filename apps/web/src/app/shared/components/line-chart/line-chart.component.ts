import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface LineChartDataPoint {
  label: string;
  value: number;
}

let nextId = 0;

@Component({
  selector: 'app-line-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
  templateUrl: './line-chart.component.html',
})
export class LineChartComponent {
  protected readonly gradientId = `line-area-fill-${nextId++}`;
  data = input.required<LineChartDataPoint[]>();
  height = input<number>(220);
  ariaLabel = input<string>();

  protected readonly padding = { top: 20, right: 16, bottom: 30, left: 40 };

  maxValue = computed(() => {
    const vals = this.data().map((d) => d.value);
    return Math.max(...vals, 1);
  });

  gridLines = computed(() => {
    const max = this.maxValue();
    const steps = 4;
    const lines: number[] = [];
    for (let i = 0; i <= steps; i++) {
      lines.push(Math.round((max / steps) * i));
    }
    return lines;
  });

  pathD = computed(() => {
    const pts = this.data();
    if (pts.length === 0) return '';
    const max = this.maxValue();
    const h = this.height();
    const p = this.padding;
    const plotW = 500 - p.left - p.right;
    const plotH = h - p.top - p.bottom;
    const stepX = pts.length > 1 ? plotW / (pts.length - 1) : plotW / 2;

    return pts
      .map((pt, i) => {
        const x = p.left + (pts.length > 1 ? i * stepX : plotW / 2);
        const y = p.top + plotH - (pt.value / max) * plotH;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  });

  areaD = computed(() => {
    const pts = this.data();
    if (pts.length === 0) return '';
    const max = this.maxValue();
    const h = this.height();
    const p = this.padding;
    const plotW = 500 - p.left - p.right;
    const plotH = h - p.top - p.bottom;
    const stepX = pts.length > 1 ? plotW / (pts.length - 1) : plotW / 2;

    const line = pts
      .map((pt, i) => {
        const x = p.left + (pts.length > 1 ? i * stepX : plotW / 2);
        const y = p.top + plotH - (pt.value / max) * plotH;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    const lastX = p.left + (pts.length > 1 ? (pts.length - 1) * stepX : plotW / 2);
    const firstX = p.left + (pts.length > 1 ? 0 : plotW / 2);
    const bottom = p.top + plotH;

    return `${line} L ${lastX} ${bottom} L ${firstX} ${bottom} Z`;
  });

  points = computed(() => {
    const pts = this.data();
    if (pts.length === 0) return [];
    const max = this.maxValue();
    const h = this.height();
    const p = this.padding;
    const plotW = 500 - p.left - p.right;
    const plotH = h - p.top - p.bottom;
    const stepX = pts.length > 1 ? plotW / (pts.length - 1) : plotW / 2;

    return pts.map((pt, i) => ({
      x: p.left + (pts.length > 1 ? i * stepX : plotW / 2),
      y: p.top + plotH - (pt.value / max) * plotH,
      label: pt.label,
      value: pt.value,
    }));
  });

  labelPositions = computed(() => {
    const pts = this.data();
    if (pts.length === 0) return [];
    const p = this.padding;
    const plotW = 500 - p.left - p.right;
    const stepX = pts.length > 1 ? plotW / (pts.length - 1) : plotW / 2;

    return pts.map((pt, i) => ({
      x: p.left + (pts.length > 1 ? i * stepX : plotW / 2),
      label: pt.label,
    }));
  });
}

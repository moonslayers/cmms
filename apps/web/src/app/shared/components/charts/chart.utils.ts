import { type ChartValueFormat } from './chart.types';

const numberFormatter = new Intl.NumberFormat('es-MX');
const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});
const percentFormatter = new Intl.NumberFormat('es-MX', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const compactFormatter = new Intl.NumberFormat('es-MX', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});

export function formatChartValue(value: number, format: ChartValueFormat): string {
  switch (format) {
    case 'currency':
      return currencyFormatter.format(value);
    case 'percent':
      return percentFormatter.format(value / 100);
    case 'compact':
      return compactFormatter.format(value);
    case 'number':
    default:
      return numberFormatter.format(value);
  }
}

const CHART_CSS_VARS = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5'] as const;

const CHART_FALLBACKS_LIGHT: Record<string, string> = {
  '--chart-1': 'oklch(0.55 0.12 245)',
  '--chart-2': 'oklch(0.78 0.15 75)',
  '--chart-3': 'oklch(0.48 0.09 245)',
  '--chart-4': 'oklch(0.65 0.14 200)',
  '--chart-5': 'oklch(0.72 0.13 55)',
};

const PRIMARY_FALLBACK_LIGHT = 'oklch(0.48 0.09 245)';

export function resolveChartPalette(): string[] {
  if (typeof document === 'undefined') {
    return CHART_CSS_VARS.map((v) => CHART_FALLBACKS_LIGHT[v] ?? PRIMARY_FALLBACK_LIGHT);
  }
  const root = document.documentElement;
  const cs = getComputedStyle(root);
  const palette: string[] = [];
  for (const cssVar of CHART_CSS_VARS) {
    const value = cs.getPropertyValue(cssVar).trim();
    palette.push(value || CHART_FALLBACKS_LIGHT[cssVar] || PRIMARY_FALLBACK_LIGHT);
  }
  return palette;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

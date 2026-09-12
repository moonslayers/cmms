export interface DonutDataPoint {
  label: string;
  value: number;
  color?: string;
}

export type ChartValueFormat = 'number' | 'currency' | 'percent' | 'compact';

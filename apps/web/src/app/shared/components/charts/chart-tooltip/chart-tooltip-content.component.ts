import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-chart-tooltip-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-2 text-xs">
      @if (color()) {
        <span
          class="inline-block size-2 shrink-0 rounded-full"
          [style.background-color]="color()!"
        ></span>
      }
      <span class="text-muted-foreground">{{ label() }}</span>
      <span class="font-medium text-foreground">{{ value() }}</span>
    </div>
  `,
})
export class ChartTooltipContentComponent {
  label = input.required<string>();
  value = input.required<string>();
  color = input<string>();
}

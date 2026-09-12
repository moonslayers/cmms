import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowDownRight, lucideArrowUpRight, lucideMinus } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-stat-card',
  imports: [HlmCardImports, NgIcon],
  providers: [provideIcons({ lucideArrowUpRight, lucideArrowDownRight, lucideMinus })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './stat-card.component.html',
})
export class StatCardComponent {
  label = input.required<string>();
  value = input.required<string | number>();
  hint = input<string>();
  trend = input<'up' | 'down' | 'flat'>();
  delta = input<string>();
  icon = input<string>();

  trendIcon = computed(() => {
    const t = this.trend();
    if (t === 'up') return 'lucideArrowUpRight';
    if (t === 'down') return 'lucideArrowDownRight';
    return 'lucideMinus';
  });

  trendClass = computed(() => {
    const t = this.trend();
    if (t === 'up') return 'text-success';
    if (t === 'down') return 'text-destructive';
    return 'text-muted-foreground';
  });
}

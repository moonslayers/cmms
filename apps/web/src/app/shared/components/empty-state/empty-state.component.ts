import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';

@Component({
  selector: 'app-empty-state',
  imports: [HlmEmptyImports, NgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  title = input.required<string>();
  description = input<string>();
  icon = input<string>();
}

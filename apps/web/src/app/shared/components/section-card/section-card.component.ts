import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
  selector: 'app-section-card',
  imports: [HlmCardImports, HlmSeparatorImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './section-card.component.html',
})
export class SectionCardComponent {
  title = input.required<string>();
  description = input<string>();
}

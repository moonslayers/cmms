import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
  selector: 'app-search-input',
  imports: [FormsModule, NgIcon, HlmButtonImports, HlmInputImports],
  providers: [provideIcons({ lucideSearch, lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative block' },
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  value = model<string>('');
  placeholder = input<string>('Buscar...');

  hasValue = computed(() => this.value().length > 0);

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  clear(): void {
    this.value.set('');
  }
}

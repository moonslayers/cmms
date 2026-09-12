import { ChangeDetectionStrategy, Component, inject, signal, DOCUMENT } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toast } from '@spartan-ng/brain/sonner';
import { ThemeService } from '../../core/services/theme.service';
import { PageHeaderComponent } from '../../shared/components/page-header';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-settings',
  imports: [
    FormsModule,
    PageHeaderComponent,
    HlmTabsImports,
    HlmSwitchImports,
    HlmButtonImports,
    HlmCardImports,
    HlmLabel,
    HlmInputImports,
    HlmSeparatorImports,
    NgIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './settings.html',
})
export class SettingsComponent {
  private readonly _themeService = inject(ThemeService);
  private readonly _document = inject(DOCUMENT);

  orgName = signal('Mantia CMMS');
  orgIndustry = signal('Manufactura');
  orgTimezone = signal('America/Mexico_City');

  notifEmailOT = signal(true);
  notifEmailStock = signal(false);
  notifAlertOT = signal(true);
  notifAlertStock = signal(true);

  theme = signal<'light' | 'dark' | 'system'>('system');
  density = signal<'compact' | 'default' | 'comfortable'>('default');

  integrations = signal([
    { name: 'SAP ERP', connected: false, icon: 'lucideExternalLink' },
    { name: 'Servidor de clima', connected: true, icon: 'lucideGlobe' },
    { name: 'Sistema de alarmas', connected: false, icon: 'lucideBell' },
    { name: 'Inventario en línea', connected: true, icon: 'lucidePackage' },
  ]);

  save(): void {
    toast.success('Cambios guardados correctamente');
  }

  toggleTheme(t: 'light' | 'dark' | 'system'): void {
    this.theme.set(t);
    if (t === 'dark') {
      this._themeService.setTheme(true);
    } else if (t === 'light') {
      this._themeService.setTheme(false);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this._themeService.setTheme(prefersDark);
    }
  }

  toggleDensity(d: 'compact' | 'default' | 'comfortable'): void {
    this.density.set(d);
    this._document.documentElement.classList.remove(
      'density-compact',
      'density-comfortable',
    );
    if (d !== 'default') {
      this._document.documentElement.classList.add(`density-${d}`);
    }
  }

  onOrgNameInput(event: Event): void {
    this.orgName.set((event.target as HTMLInputElement).value);
  }

  onOrgIndustryInput(event: Event): void {
    this.orgIndustry.set((event.target as HTMLInputElement).value);
  }

  onOrgTimezoneInput(event: Event): void {
    this.orgTimezone.set((event.target as HTMLInputElement).value);
  }
}

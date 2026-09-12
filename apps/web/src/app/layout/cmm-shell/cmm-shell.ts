import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideLayoutDashboard,
  lucideClipboardList,
  lucideWrench,
  lucideCalendarClock,
  lucidePackage,
  lucideBarChart3,
  lucideUsers,
  lucideMapPin,
  lucideSettings,
  lucideLogOut,
  lucideBell,
  lucideSearch,
  lucideMenu,
  lucideMoon,
  lucideChevronsUpDown,
  lucideSun,
  lucideUser,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-cmm-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideLayoutDashboard,
      lucideClipboardList,
      lucideWrench,
      lucideCalendarClock,
      lucidePackage,
      lucideBarChart3,
      lucideUsers,
      lucideMapPin,
      lucideSettings,
      lucideLogOut,
      lucideBell,
      lucideSearch,
      lucideMenu,
      lucideSun,
      lucideMoon,
      lucideChevronsUpDown,
      lucideUser,
    }),
  ],
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIcon,
    HlmSidebarImports,
    HlmButtonImports,
    HlmAvatarImports,
    HlmDropdownMenuImports,
    HlmInputImports,
    HlmTooltipImports,
  ],
  templateUrl: './cmm-shell.html',
  host: {
    class: 'flex h-svh w-full overflow-hidden',
  },
})
export class CmmShell {
  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);
  protected readonly _theme = inject(ThemeService);

  protected readonly user = this._auth.user;
  protected readonly isAuthenticated = this._auth.isAuthenticated;

  protected readonly userInitials = computed(() => {
    const u = this.user();
    if (!u?.nombre) return '??';
    return u.nombre
      .split(' ')
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('');
  });

  protected readonly displayName = computed(() => {
    const u = this.user();
    return u?.nombre ?? u?.email ?? 'Usuario';
  });

  protected readonly navItems = [
    { route: '/app/dashboard', icon: 'lucideLayoutDashboard', label: 'Dashboard' },
    { route: '/app/ordenes', icon: 'lucideClipboardList', label: 'Órdenes de trabajo' },
    { route: '/app/activos', icon: 'lucideWrench', label: 'Activos y equipos' },
    { route: '/app/preventivo', icon: 'lucideCalendarClock', label: 'Mantenimiento preventivo' },
    { route: '/app/inventario', icon: 'lucidePackage', label: 'Inventario y repuestos' },
    { route: '/app/reportes', icon: 'lucideBarChart3', label: 'Reportes' },
    { route: '/app/tecnicos', icon: 'lucideUsers', label: 'Técnicos' },
    { route: '/app/ubicaciones', icon: 'lucideMapPin', label: 'Ubicaciones' },
    { route: '/app/configuracion', icon: 'lucideSettings', label: 'Configuración' },
  ];

  logout(): void {
    this._auth.logout();
    this._router.navigate(['/']);
  }
}

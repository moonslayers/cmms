import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing').then((m) => m.default),
    title: 'Mantia — Gestión de Mantenimiento',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.default),
    title: 'Mantia — Iniciar sesión',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.default),
    title: 'Mantia — Crear cuenta',
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/cmm-shell/cmm-shell').then((m) => m.CmmShell),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(
            (m) => m.DashboardComponent,
          ),
        title: 'Mantia — Panel de control',
      },
      {
        path: 'ordenes',
        loadComponent: () =>
          import('./features/work-orders/work-orders').then(
            (m) => m.WorkOrdersComponent,
          ),
        title: 'Mantia — Órdenes de trabajo',
      },
      {
        path: 'activos',
        loadComponent: () =>
          import('./features/assets/assets').then((m) => m.AssetsComponent),
        title: 'Mantia — Activos y equipos',
      },
      {
        path: 'preventivo',
        loadComponent: () =>
          import('./features/preventive/preventive').then(
            (m) => m.PreventiveComponent,
          ),
        title: 'Mantia — Mantenimiento preventivo',
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./features/inventory/inventory').then(
            (m) => m.InventoryComponent,
          ),
        title: 'Mantia — Inventario y repuestos',
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./features/reports/reports').then(
            (m) => m.ReportsComponent,
          ),
        title: 'Mantia — Reportes',
      },
      {
        path: 'tecnicos',
        loadComponent: () =>
          import('./features/technicians/technicians').then(
            (m) => m.TechniciansComponent,
          ),
        title: 'Mantia — Técnicos',
      },
      {
        path: 'ubicaciones',
        loadComponent: () =>
          import('./features/locations/locations').then(
            (m) => m.LocationsComponent,
          ),
        title: 'Mantia — Ubicaciones',
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('./features/settings/settings').then(
            (m) => m.SettingsComponent,
          ),
        title: 'Mantia — Configuración',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import {
  MOCK_DASHBOARD_DATA,
  MOCK_LOW_STOCK_PARTS,
  MOCK_RECENT_WORK_ORDERS,
  MOCK_UPCOMING_PREVENTIVE,
} from '../../core/mock';
import { BarChartComponent } from '../../shared/components/bar-chart';
import { DataTableComponent, type TableColumn } from '../../shared/components/data-table';
import { DonutChartComponent } from '../../shared/components/donut-chart';
import { LineChartComponent } from '../../shared/components/line-chart';
import { PageHeaderComponent } from '../../shared/components/page-header';
import { SectionCardComponent } from '../../shared/components/section-card';
import { StatCardComponent } from '../../shared/components/stat-card';

@Component({
  selector: 'app-dashboard',
  imports: [
    NgIcon,
    HlmButtonImports,
    PageHeaderComponent,
    StatCardComponent,
    SectionCardComponent,
    DonutChartComponent,
    LineChartComponent,
    BarChartComponent,
    DataTableComponent,
  ],
  providers: [provideIcons({ lucideDownload, lucideTriangleAlert })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  protected readonly data = MOCK_DASHBOARD_DATA;

  protected readonly otRows = computed(() =>
    MOCK_RECENT_WORK_ORDERS.map((wo) => ({
      codigo: wo.id,
      titulo: wo.titulo,
      activo: wo.assetTag,
      prioridad: wo.prioridad,
      estado: wo.estado,
      tecnico: wo.tecnicoAsignado,
      fecha: new Date(wo.fechaProgramada).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    })),
  );

  protected readonly otColumns: TableColumn[] = [
    { key: 'codigo', label: 'Código', type: 'mono' },
    { key: 'titulo', label: 'Título' },
    { key: 'activo', label: 'Activo', type: 'mono' },
    { key: 'prioridad', label: 'Prioridad', type: 'status' },
    { key: 'estado', label: 'Estado', type: 'status' },
    { key: 'tecnico', label: 'Técnico' },
    { key: 'fecha', label: 'Fecha' },
  ];

  protected readonly upcomingRows = computed(() =>
    MOCK_UPCOMING_PREVENTIVE.map((p) => ({
      nombre: p.nombre,
      activo: p.assetTag,
      proximaFecha: new Date(p.proximaFecha).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      tecnico: p.tecnico,
    })),
  );

  protected readonly lowStockRows = computed(() =>
    MOCK_LOW_STOCK_PARTS.map((s) => ({
      sku: s.sku,
      nombre: s.nombre,
      stockActual: `${s.stockActual} ${s.unidad}`,
      stockMinimo: `${s.stockMinimo} ${s.unidad}`,
      deficit: s.stockMinimo - s.stockActual,
    })),
  );

  protected readonly currentPeriod = computed(() => {
    const now = new Date();
    return now.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  });
}

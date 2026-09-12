import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
const CURRENCY_ES = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
import { NgIcon } from '@ng-icons/core';
import { lucideDownload } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { MOCK_DASHBOARD_DATA, MOCK_WORK_ORDERS, MOCK_ASSETS } from '../../core/mock';
import { BarChartComponent } from '../../shared/components/bar-chart';
import { DonutChartComponent } from '../../shared/components/donut-chart';
import { LineChartComponent } from '../../shared/components/line-chart';
import { PageHeaderComponent } from '../../shared/components/page-header';
import { SectionCardComponent } from '../../shared/components/section-card';
import { StatCardComponent } from '../../shared/components/stat-card';
import { DataTableComponent, type TableColumn } from '../../shared/components/data-table';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmSelectImports,
    PageHeaderComponent,
    StatCardComponent,
    SectionCardComponent,
    LineChartComponent,
    BarChartComponent,
    DonutChartComponent,
    DataTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './reports.html',
})
export class ReportsComponent {
  protected readonly lucideDownload = lucideDownload;

  readonly dateRangeOptions = [
    { label: 'Últimos 30 días', value: '30d' },
    { label: 'Este trimestre', value: 'quarter' },
    { label: 'Este año', value: 'year' },
  ];

  readonly dateRange = signal('30d');

  readonly itemToString = (value: string) =>
    this.dateRangeOptions.find((o) => o.value === value)?.label ?? '';

  private readonly completedOrders = computed(() =>
    MOCK_WORK_ORDERS.filter((o) => o.estado === 'completada'),
  );

  readonly mttrHours = computed(() => {
    const completed = this.completedOrders();
    if (completed.length === 0) return 0;
    const totalMs = completed.reduce((sum, o) => {
      const created = new Date(o.fechaCreacion).getTime();
      const done = new Date(o.fechaCompletada!).getTime();
      return sum + (done - created);
    }, 0);
    return Math.round((totalMs / completed.length / (1000 * 60 * 60)) * 10) / 10;
  });

  readonly mtbfDays = computed(() => {
    const completed = this.completedOrders();
    if (completed.length <= 1) return 0;
    const sorted = [...completed].sort(
      (a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime(),
    );
    const intervals = sorted.slice(1).map((o, i) => {
      const prev = new Date(sorted[i].fechaCompletada!).getTime();
      const curr = new Date(sorted[i + 1].fechaCreacion).getTime();
      return curr - prev;
    });
    const avg = intervals.reduce((s, v) => s + v, 0) / intervals.length;
    return Math.round((avg / (1000 * 60 * 60 * 24)) * 10) / 10;
  });

  readonly cumplimientoPreventivo = computed(
    () => MOCK_DASHBOARD_DATA.kpis.cumplimientoPreventivo.value,
  );

  readonly costoTotal = computed(() =>
    MOCK_WORK_ORDERS.reduce((sum, o) => sum + o.costoEstimado, 0),
  );

  readonly otCerradas = computed(() => this.completedOrders().length);

  readonly totalOt = MOCK_WORK_ORDERS.length;

  readonly tendenciaData = computed(() => MOCK_DASHBOARD_DATA.tendenciaMensual);

  readonly costoPorMesData = computed(() => MOCK_DASHBOARD_DATA.costoPorMes);

  readonly otPorTipoData = computed(() =>
    MOCK_DASHBOARD_DATA.distribucionPorTipo.map((d) => ({
      label: d.label,
      value: d.value,
    })),
  );

  readonly otPorTecnicoData = computed(() => {
    const counts: Record<string, number> = {};
    for (const wo of MOCK_WORK_ORDERS) {
      counts[wo.tecnicoAsignado] = (counts[wo.tecnicoAsignado] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ label: name.split(' ')[0], value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  });

  readonly assetTableColumns: TableColumn[] = [
    { key: 'activo', label: 'Activo' },
    { key: 'otCount', label: 'OT', align: 'center', type: 'number' },
    { key: 'costo', label: 'Costo', align: 'right', type: 'number' },
    { key: 'disponibilidad', label: 'Disponibilidad', align: 'center' },
  ];

  readonly assetTableRows = computed(() => {
    const assetMap = new Map<
      string,
      { nombre: string; otCount: number; costo: number; estado: string }
    >();
    for (const asset of MOCK_ASSETS) {
      assetMap.set(asset.id, {
        nombre: asset.nombre,
        otCount: 0,
        costo: 0,
        estado: asset.estado,
      });
    }
    for (const wo of MOCK_WORK_ORDERS) {
      const entry = assetMap.get(wo.assetTag);
      if (entry) {
        entry.otCount++;
        entry.costo += wo.costoEstimado;
      }
    }
    return Array.from(assetMap.entries())
      .filter(([, v]) => v.otCount > 0)
      .map(([id, v]) => ({
        activo: id,
        otCount: v.otCount,
        costo: CURRENCY_ES.format(v.costo),
        disponibilidad: v.estado === 'operativo' ? 'Sí' : 'No',
      }));
  });

  formatCurrency(value: number): string {
    return CURRENCY_ES.format(value);
  }

  exportar(): void {
    toast.success('Reporte exportado correctamente', {
      description: 'El archivo CSV está listo para descargar.',
    });
  }
}

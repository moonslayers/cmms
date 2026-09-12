import { ChangeDetectionStrategy, Component, computed, inject, signal, type TemplateRef, viewChild } from '@angular/core';
import { DateTime } from 'luxon';
import { NgIcon } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports, HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { MOCK_PREVENTIVE_PLANS } from '../../core/mock';
import type { PreventivePlan } from '../../core/models';
import { DataTableComponent, type TableColumn } from '../../shared/components/data-table';
import { PageHeaderComponent } from '../../shared/components/page-header';
import { SearchInputComponent } from '../../shared/components/search-input';
import { SectionCardComponent } from '../../shared/components/section-card';
import { StatCardComponent } from '../../shared/components/stat-card';

@Component({
  selector: 'app-preventive',
  standalone: true,
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmDialogImports,
    HlmSelectImports,
    PageHeaderComponent,
    SearchInputComponent,
    SectionCardComponent,
    StatCardComponent,
    DataTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './preventive.html',
})
export class PreventiveComponent {
  private readonly _dialogService = inject(HlmDialogService);

  protected readonly newPlanDialog = viewChild.required<TemplateRef<unknown>>('newPlanDialog');

  protected readonly plans = MOCK_PREVENTIVE_PLANS;
  protected readonly today = DateTime.now();

  protected readonly searchQuery = signal('');
  protected readonly frecuenciaFilter = signal('');
  protected readonly estadoFilter = signal('');

  protected readonly frecuencias = [
    { label: 'Diaria', value: 'diaria' },
    { label: 'Semanal', value: 'semanal' },
    { label: 'Mensual', value: 'mensual' },
    { label: 'Trimestral', value: 'trimestral' },
    { label: 'Anual', value: 'anual' },
  ];

  protected readonly estados = [
    { label: 'Activo', value: 'activo' },
    { label: 'Pausado', value: 'pausado' },
    { label: 'Vencido', value: 'vencido' },
  ];

  protected readonly frecuenciaToString = (value: string) =>
    this.frecuencias.find((f) => f.value === value)?.label ?? '';

  protected readonly estadoToString = (value: string) =>
    this.estados.find((e) => e.value === value)?.label ?? '';

  protected readonly filteredPlans = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const freq = this.frecuenciaFilter();
    const est = this.estadoFilter();
    return this.plans.filter((p) => {
      if (
        q &&
        !p.nombre.toLowerCase().includes(q) &&
        !p.assetTag.toLowerCase().includes(q) &&
        !p.tecnico.toLowerCase().includes(q)
      )
        return false;
      if (freq && String(p.frecuencia) !== freq) return false;
      if (est && p.estado !== est) return false;
      return true;
    });
  });

  protected readonly activos = computed(
    () => this.plans.filter((p) => p.estado === 'activo').length,
  );

  protected readonly vencidos = computed(
    () => this.plans.filter((p) => DateTime.fromISO(p.proximaFecha) < this.today).length,
  );

  protected readonly proximos7 = computed(() => {
    const end = this.today.plus({ days: 7 });
    return this.plans.filter((p) => {
      const d = DateTime.fromISO(p.proximaFecha);
      return d >= this.today && d <= end;
    }).length;
  });

  protected readonly cumplimiento = computed(() => {
    const total = this.plans.length;
    if (total === 0) return 0;
    const onTime = this.plans.filter(
      (p) => DateTime.fromISO(p.proximaFecha) >= this.today,
    ).length;
    return Math.round((onTime / total) * 100);
  });

  protected readonly tableColumns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'assetTag', label: 'Activo', type: 'mono' },
    { key: 'frecuencia', label: 'Frecuencia' },
    { key: 'proximaFecha', label: 'Próxima fecha' },
    { key: 'ultimaEjecucion', label: 'Última ejecución', type: 'mono' },
    { key: 'tecnico', label: 'Técnico' },
    { key: 'duracion', label: 'Duración', type: 'number', align: 'right' },
    { key: 'estado', label: 'Estado', type: 'status' },
  ];

  protected readonly tableRows = computed(() =>
    this.filteredPlans().map((p) => this.formatRow(p)),
  );

  protected readonly upcoming30 = computed(() => {
    const start = this.today.minus({ days: 30 });
    const end = this.today.plus({ days: 30 });
    return this.plans
      .filter((p) => {
        const d = DateTime.fromISO(p.proximaFecha);
        return d >= start && d <= end;
      })
      .sort(
        (a, b) =>
          DateTime.fromISO(a.proximaFecha).toMillis() -
          DateTime.fromISO(b.proximaFecha).toMillis(),
      );
  });

  onFrecuenciaChange(value: string | undefined | null): void {
    this.frecuenciaFilter.set(value ?? '');
  }

  onEstadoChange(value: string | undefined | null): void {
    this.estadoFilter.set(value ?? '');
  }

  openNewPlan(): void {
    this._dialogService.open(this.newPlanDialog(), {
      contentClass: 'sm:max-w-md',
    });
  }

  formatRow(p: PreventivePlan) {
    const d = DateTime.fromISO(p.proximaFecha);
    const diff = d.diff(this.today, 'days').days;
    const formatted = d.toFormat('dd/MM/yyyy');
    let relativeLabel: string;

    if (diff < 0) {
      const absDiff = Math.abs(Math.round(diff));
      relativeLabel = `Vencido hace ${absDiff} día${absDiff === 1 ? '' : 's'}`;
    } else if (diff <= 7) {
      const rounded = Math.round(diff);
      relativeLabel =
        rounded === 0 ? 'Hoy' : rounded === 1 ? 'Mañana' : `Vence en ${rounded} días`;
    } else {
      relativeLabel = `En ${Math.round(diff)} días`;
    }

    return {
      nombre: p.nombre,
      assetTag: p.assetTag,
      frecuencia: this.formatFrecuencia(p.frecuencia),
      proximaFecha: `${formatted} · ${relativeLabel}`,
      ultimaEjecucion: p.ultimaEjecucion
        ? DateTime.fromISO(p.ultimaEjecucion).toFormat('dd/MM/yyyy')
        : '—',
      tecnico: p.tecnico,
      duracion: p.duracionEstimadaHoras,
      estado: p.estado,
    };
  }

  formatFrecuencia(frecuencia: string | number): string {
    if (typeof frecuencia === 'number') return `Cada ${frecuencia} días`;
    return frecuencia.charAt(0).toUpperCase() + frecuencia.slice(1);
  }

  formatRelativeDate(isoDate: string): string {
    const d = DateTime.fromISO(isoDate);
    const diff = d.diff(this.today, 'days').days;
    if (diff < 0) {
      const absDiff = Math.abs(Math.round(diff));
      return `hace ${absDiff} día${absDiff === 1 ? '' : 's'}`;
    }
    const rounded = Math.round(diff);
    if (rounded === 0) return 'hoy';
    if (rounded === 1) return 'mañana';
    return `en ${rounded} días`;
  }

  getUpcomingClass(p: PreventivePlan): string {
    const d = DateTime.fromISO(p.proximaFecha);
    const diff = d.diff(this.today, 'days').days;
    if (diff < 0) return 'text-destructive';
    if (diff <= 7) return 'text-amber-600 dark:text-amber-400';
    return 'text-muted-foreground';
  }
}

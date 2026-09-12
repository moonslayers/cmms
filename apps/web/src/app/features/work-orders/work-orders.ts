import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal, type TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports, HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { MOCK_WORK_ORDERS } from '../../core/mock';
import type { WorkOrder, WorkOrderPriority, WorkOrderStatus } from '../../core/models';
import { DataTableComponent, type TableColumn } from '../../shared/components/data-table';
import { EmptyStateComponent } from '../../shared/components/empty-state';
import { PageHeaderComponent } from '../../shared/components/page-header';
import { SearchInputComponent } from '../../shared/components/search-input';
import { SectionCardComponent } from '../../shared/components/section-card';
import { StatCardComponent } from '../../shared/components/stat-card';
import { StatusBadgeComponent } from '../../shared/components/status-badge';

const STATUS_LABELS: Record<WorkOrderStatus, string> = {
  abierta: 'Abierta',
  en_progreso: 'En progreso',
  en_espera: 'En espera',
  completada: 'Completada',
  cancelada: 'Cancelada',
};

const PRIORITY_LABELS: Record<WorkOrderPriority, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  crítica: 'Crítica',
};

@Component({
  selector: 'app-work-orders',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    FormsModule,
    NgIcon,
    HlmButtonImports,
    HlmDialogImports,
    HlmSelectImports,
    PageHeaderComponent,
    StatCardComponent,
    SectionCardComponent,
    SearchInputComponent,
    DataTableComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './work-orders.html',
})
export class WorkOrdersComponent {
  private readonly _dialogService = inject(HlmDialogService);

  readonly detailDialog = viewChild.required<TemplateRef<unknown>>('detailDialog');
  readonly newOrderDialog = viewChild.required<TemplateRef<unknown>>('newOrderDialog');

  readonly selectedOrder = signal<WorkOrder | null>(null);

  readonly searchText = signal('');
  readonly filterEstado = signal<string>('');
  readonly filterPrioridad = signal<string>('');
  readonly filterTecnico = signal<string>('');

  readonly estadoOptions = [
    { label: 'Todos', value: '' },
    { label: 'Abierta', value: 'abierta' },
    { label: 'En progreso', value: 'en_progreso' },
    { label: 'En espera', value: 'en_espera' },
    { label: 'Completada', value: 'completada' },
    { label: 'Cancelada', value: 'cancelada' },
  ];

  readonly prioridadOptions = [
    { label: 'Todas', value: '' },
    { label: 'Baja', value: 'baja' },
    { label: 'Media', value: 'media' },
    { label: 'Alta', value: 'alta' },
    { label: 'Crítica', value: 'crítica' },
  ];

  readonly tecnicoOptions = [
    { label: 'Todos', value: '' },
    { label: 'Carlos Mendoza', value: 'Carlos Mendoza' },
    { label: 'María López', value: 'María López' },
    { label: 'Roberto García', value: 'Roberto García' },
    { label: 'Ana Ramírez', value: 'Ana Ramírez' },
    { label: 'Pedro Sánchez', value: 'Pedro Sánchez' },
    { label: 'Laura Torres', value: 'Laura Torres' },
  ];

  readonly estadoToString = (value: string) =>
    this.estadoOptions.find((o) => o.value === value)?.label ?? value;

  readonly prioridadToString = (value: string) =>
    this.prioridadOptions.find((o) => o.value === value)?.label ?? value;

  readonly tecnicoToString = (value: string) =>
    this.tecnicoOptions.find((o) => o.value === value)?.label ?? value;

  readonly tipoToString = (value: string) => {
    const map: Record<string, string> = {
      correctivo: 'Correctivo',
      preventivo: 'Preventivo',
      predictivo: 'Predictivo',
    };
    return map[value] ?? value;
  };

  readonly filteredOrders = computed(() => {
    let orders = [...MOCK_WORK_ORDERS];
    const search = this.searchText().toLowerCase().trim();
    if (search) {
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(search) ||
          o.titulo.toLowerCase().includes(search) ||
          o.assetTag.toLowerCase().includes(search) ||
          o.tecnicoAsignado.toLowerCase().includes(search),
      );
    }
    const estado = this.filterEstado();
    if (estado) orders = orders.filter((o) => o.estado === estado);
    const prioridad = this.filterPrioridad();
    if (prioridad) orders = orders.filter((o) => o.prioridad === prioridad);
    const tecnico = this.filterTecnico();
    if (tecnico) orders = orders.filter((o) => o.tecnicoAsignado === tecnico);
    return orders;
  });

  readonly totalOrders = computed(() => MOCK_WORK_ORDERS.length);

  readonly openOrders = computed(() => MOCK_WORK_ORDERS.filter((o) => o.estado === 'abierta').length);

  readonly inProgressOrders = computed(
    () => MOCK_WORK_ORDERS.filter((o) => o.estado === 'en_progreso').length,
  );

  readonly completedThisMonth = computed(() => {
    const now = new Date();
    return MOCK_WORK_ORDERS.filter((o) => {
      if (o.estado !== 'completada' || !o.fechaCompletada) return false;
      const d = new Date(o.fechaCompletada);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  });

  readonly tableColumns: TableColumn[] = [
    { key: 'codigo', label: 'Código', type: 'mono' },
    { key: 'titulo', label: 'Título' },
    { key: 'activo', label: 'Activo', type: 'mono' },
    { key: 'prioridad', label: 'Prioridad', type: 'status' },
    { key: 'estado', label: 'Estado', type: 'status' },
    { key: 'tecnico', label: 'Técnico' },
    { key: 'fechaProgramada', label: 'Fecha programada' },
    { key: 'costo', label: 'Costo', type: 'number', align: 'right' },
  ];

  readonly tableRows = computed(() =>
    this.filteredOrders().map((o) => ({
      id: o.id,
      codigo: o.id,
      titulo: o.titulo,
      activo: o.assetTag,
      prioridad: o.prioridad,
      estado: o.estado,
      tecnico: o.tecnicoAsignado,
      fechaProgramada: new Date(o.fechaProgramada).toLocaleDateString('es-MX'),
      costo: o.costoEstimado,
    })),
  );

  readonly detailTimeline = computed(() => {
    const order = this.selectedOrder();
    if (!order) return [];
    const created = new Date(order.fechaCreacion);
    const timeline: { label: string; date: Date; done: boolean; icon: string }[] = [
      { label: 'Orden creada', date: created, done: true, icon: 'lucideClipboardList' },
    ];
    if (order.tecnicoAsignado) {
      const assigned = new Date(created);
      assigned.setHours(assigned.getHours() + 1);
      timeline.push({
        label: `Asignada a ${order.tecnicoAsignado}`,
        date: assigned,
        done: true,
        icon: 'lucideUser',
      });
    }
    if (order.estado === 'en_progreso' || order.estado === 'completada') {
      const started = new Date(created);
      started.setDate(started.getDate() + 1);
      timeline.push({ label: 'En progreso', date: started, done: true, icon: 'lucideWrench' });
    }
    if (order.estado === 'completada' && order.fechaCompletada) {
      timeline.push({
        label: 'Completada',
        date: new Date(order.fechaCompletada),
        done: true,
        icon: 'lucideCircleCheck',
      });
    } else if (order.estado === 'cancelada') {
      timeline.push({ label: 'Cancelada', date: new Date(), done: false, icon: 'lucideClock' });
    } else {
      timeline.push({ label: 'Pendiente', date: new Date(), done: false, icon: 'lucideClock' });
    }
    return timeline;
  });

  formatStatus(status: string): string {
    return STATUS_LABELS[status as WorkOrderStatus] ?? status;
  }

  formatPriority(priority: string): string {
    return PRIORITY_LABELS[priority as WorkOrderPriority] ?? priority;
  }

  onTableClick(event: Event): void {
    const target = event.target as HTMLElement;
    const row = target.closest('tr[hlmTableRow]');
    if (!row) return;
    const cells = row.querySelectorAll('td[hlmTableCell]');
    if (cells.length === 0) return;
    const codigo = cells[0]?.textContent?.trim();
    if (!codigo) return;
    const order = this.filteredOrders().find((o) => o.id === codigo);
    if (order) this.openDetail(order);
  }

  openDetail(order: WorkOrder): void {
    this.selectedOrder.set(order);
    this._dialogService.open(this.detailDialog(), {
      contentClass: 'sm:max-w-lg',
    });
  }

  openNewOrder(): void {
    this._dialogService.open(this.newOrderDialog(), {
      contentClass: 'sm:max-w-md',
    });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  type TemplateRef,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports, HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { MOCK_SPARE_PARTS } from '../../core/mock';
import type { SparePart, SparePartCategory } from '../../core/models';
import { DataTableComponent, type TableColumn } from '../../shared/components/data-table';
import { EmptyStateComponent } from '../../shared/components/empty-state';
import { PageHeaderComponent } from '../../shared/components/page-header';
import { SearchInputComponent } from '../../shared/components/search-input';
import { SectionCardComponent } from '../../shared/components/section-card';
import { StatCardComponent } from '../../shared/components/stat-card';

const CURRENCY_ES = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

const CATEGORY_LABELS: Record<SparePartCategory, string> = {
  rodamiento: 'Rodamiento',
  filtro: 'Filtro',
  correa: 'Correa',
  sello: 'Sello',
  motor: 'Motor',
  bombilla: 'Bombilla',
  fusible: 'Fusible',
  válvula: 'Válvula',
  sensor: 'Sensor',
  lubricante: 'Lubricante',
};

@Component({
  selector: 'app-inventory',
  standalone: true,
  templateUrl: './inventory.html',
  imports: [
    NgIcon,
    FormsModule,
    HlmButtonImports,
    HlmDialogImports,
    HlmInputImports,
    HlmSelectImports,
    PageHeaderComponent,
    StatCardComponent,
    SectionCardComponent,
    SearchInputComponent,
    DataTableComponent,
    EmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class InventoryComponent {
  private readonly _dialogService = inject(HlmDialogService);

  protected readonly parts = MOCK_SPARE_PARTS;

  readonly movementDialog = viewChild.required<TemplateRef<unknown>>('movementDialog');

  readonly searchQuery = signal('');
  readonly selectedCategory = signal('');
  readonly selectedStockStatus = signal('');

  readonly movimientoTipo = signal<'entrada' | 'salida'>('entrada');
  readonly movimientoRepuesto = signal('');
  readonly movimientoCantidad = signal(1);
  readonly movimientoMotivo = signal('');

  readonly categories = computed(() => {
    const cats = new Set<SparePartCategory>(MOCK_SPARE_PARTS.map((p) => p.categoria));
    return [...cats].sort();
  });

  readonly lowStockParts = computed(() =>
    MOCK_SPARE_PARTS.filter((p) => p.stockActual < p.stockMinimo),
  );

  readonly filteredParts = computed(() => {
    let result = [...MOCK_SPARE_PARTS];
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      result = result.filter(
        (p) =>
          p.sku.toLowerCase().includes(q) ||
          p.nombre.toLowerCase().includes(q) ||
          p.proveedor.toLowerCase().includes(q) ||
          p.ubicacionAlmacen.toLowerCase().includes(q),
      );
    }
    const cat = this.selectedCategory();
    if (cat) {
      result = result.filter((p) => p.categoria === cat);
    }
    const status = this.selectedStockStatus();
    if (status) {
      result = result.filter((p) => this.getStockStatus(p) === status);
    }
    return result;
  });

  readonly totalSkus = computed(() => MOCK_SPARE_PARTS.length);

  readonly lowStockCount = computed(
    () => MOCK_SPARE_PARTS.filter((p) => p.stockActual < p.stockMinimo).length,
  );

  readonly totalValue = computed(() =>
    MOCK_SPARE_PARTS.reduce((sum, p) => sum + p.stockActual * p.costoUnitario, 0),
  );

  readonly outOfStockCount = computed(
    () => MOCK_SPARE_PARTS.filter((p) => p.stockActual === 0).length,
  );

  readonly tableRows = computed(() =>
    this.filteredParts().map((p) => ({
      ...p,
      stockStatus: this.getStockStatus(p),
    })),
  );

  readonly columns: TableColumn[] = [
    { key: 'sku', label: 'SKU', type: 'mono' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'stockActual', label: 'Stock', type: 'number', align: 'right' },
    { key: 'stockMinimo', label: 'Mínimo', type: 'number', align: 'right' },
    { key: 'stockStatus', label: 'Estado', type: 'status' },
    { key: 'costoUnitario', label: 'Costo Unit.', type: 'number', align: 'right' },
    { key: 'proveedor', label: 'Proveedor' },
    { key: 'ubicacionAlmacen', label: 'Ubicación' },
  ];

  readonly categoryItemToString = (value: string): string => {
    if (!value) return 'Todas';
    return CATEGORY_LABELS[value as SparePartCategory] ?? value;
  };

  readonly stockStatusItemToString = (value: string): string => {
    if (!value) return 'Todos';
    const labels: Record<string, string> = {
      disponible: 'Disponible',
      bajo: 'Bajo',
      agotado: 'Agotado',
    };
    return labels[value] ?? value;
  };

  readonly partItemToString = (value: string): string => {
    if (!value) return '';
    const part = MOCK_SPARE_PARTS.find((p) => p.sku === value);
    return part ? `${part.sku} - ${part.nombre}` : value;
  };

  formatCurrency(value: number): string {
    return CURRENCY_ES.format(value);
  }

  getStockStatus(part: SparePart): string {
    if (part.stockActual === 0) return 'agotado';
    if (part.stockActual < part.stockMinimo) return 'bajo';
    return 'disponible';
  }

  reorderQty(part: SparePart): number {
    return Math.max(0, part.stockMinimo - part.stockActual + Math.ceil(part.stockMinimo * 0.2));
  }

  openDialog(): void {
    this._dialogService.open(this.movementDialog(), {
      contentClass: 'sm:max-w-md',
    });
  }

  confirmMovimiento(): void {
    this.movimientoTipo.set('entrada');
    this.movimientoRepuesto.set('');
    this.movimientoCantidad.set(1);
    this.movimientoMotivo.set('');
  }
}

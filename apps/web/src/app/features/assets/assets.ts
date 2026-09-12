import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  type TemplateRef,
  viewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBoxes,
  lucideLayoutGrid,
  lucideLayoutList,
  lucidePlus,
  lucideX,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDialogImports, HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { MOCK_ASSETS, MOCK_PREVENTIVE_PLANS, MOCK_WORK_ORDERS } from '../../core/mock';
import type { Asset, AssetCategory } from '../../core/models';
import { DataTableComponent, type TableColumn } from '../../shared/components/data-table';
import { EmptyStateComponent } from '../../shared/components/empty-state';
import { PageHeaderComponent } from '../../shared/components/page-header';
import { SearchInputComponent } from '../../shared/components/search-input';
import { StatCardComponent } from '../../shared/components/stat-card';
import { StatusBadgeComponent } from '../../shared/components/status-badge';

const CATEGORY_LABELS: Record<AssetCategory, string> = {
  CNC: 'CNC',
  compresor: 'Compresor',
  bomba: 'Bomba',
  cinta_transportadora: 'Cinta transportadora',
  montacargas: 'Montacargas',
  horno: 'Horno',
  torno: 'Torno',
  generador: 'Generador',
  transformador: 'Transformador',
  refrigeración: 'Refrigeración',
};

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmDialogImports,
    HlmTabsImports,
    HlmToggleGroupImports,
    PageHeaderComponent,
    StatCardComponent,
    StatusBadgeComponent,
    SearchInputComponent,
    DataTableComponent,
    EmptyStateComponent,
  ],
  providers: [
    provideIcons({ lucideBoxes, lucideLayoutGrid, lucideLayoutList, lucidePlus, lucideX }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assets.html',
})
export class AssetsComponent {
  private readonly _dialogService = inject(HlmDialogService);

  readonly detailDialog = viewChild.required<TemplateRef<unknown>>('detailDialog');

  readonly assets = MOCK_ASSETS;
  readonly workOrders = MOCK_WORK_ORDERS;
  readonly preventivePlans = MOCK_PREVENTIVE_PLANS;

  readonly searchQuery = signal('');
  readonly categoryFilter = signal<string>('todos');
  readonly viewMode = signal<'cards' | 'table'>('cards');
  readonly selectedAsset = signal<Asset | null>(null);

  readonly categories = computed(() => {
    const cats = new Set(this.assets.map((a) => a.categoria));
    return Array.from(cats);
  });

  readonly filteredAssets = computed(() => {
    let result = this.assets;
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(
        (a) =>
          a.nombre.toLowerCase().includes(query) ||
          a.id.toLowerCase().includes(query),
      );
    }
    const cat = this.categoryFilter();
    if (cat && cat !== 'todos') {
      result = result.filter((a) => a.categoria === cat);
    }
    return result;
  });

  readonly totalAssets = computed(() => this.assets.length);
  readonly operationalCount = computed(
    () => this.assets.filter((a) => a.estado === 'operativo').length,
  );
  readonly maintenanceCount = computed(
    () => this.assets.filter((a) => a.estado === 'en_mantenimiento').length,
  );
  readonly outOfServiceCount = computed(
    () => this.assets.filter((a) => a.estado === 'fuera_de_servicio').length,
  );

  readonly detailWorkOrders = computed(() => {
    const asset = this.selectedAsset();
    if (!asset) return [];
    return this.workOrders.filter((wo) => wo.assetTag === asset.id);
  });

  readonly detailPreventivePlans = computed(() => {
    const asset = this.selectedAsset();
    if (!asset) return [];
    return this.preventivePlans.filter((pp) => pp.assetTag === asset.id);
  });

  readonly tableColumns: TableColumn[] = [
    { key: 'id', label: 'Tag', type: 'mono' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'criticidad', label: 'Criticidad', type: 'status' },
    { key: 'estado', label: 'Estado', type: 'status' },
    { key: 'proximoMantenimiento', label: 'Próx. mantención' },
  ];

  readonly tableRows = computed(() =>
    this.filteredAssets().map((a) => ({
      id: a.id,
      nombre: a.nombre,
      categoria: CATEGORY_LABELS[a.categoria] ?? a.categoria,
      ubicacion: a.ubicacion,
      criticidad: a.criticidad,
      estado: a.estado,
      proximoMantenimiento: a.proximoMantenimiento,
    })),
  );

  onCategoryChange(event: Event): void {
    this.categoryFilter.set((event.target as HTMLSelectElement).value);
  }

  onViewModeChange(value: unknown): void {
    const v = Array.isArray(value) ? value[0] : value;
    if (v === 'cards' || v === 'table') {
      this.viewMode.set(v);
    }
  }

  openDetail(asset: Asset): void {
    this.selectedAsset.set(asset);
    this._dialogService.open(this.detailDialog(), {
      contentClass: 'sm:max-w-2xl',
    });
  }

  formatCategory(cat: AssetCategory): string {
    return CATEGORY_LABELS[cat] ?? cat;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-MX');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  }
}

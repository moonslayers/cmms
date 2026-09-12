import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MOCK_LOCATIONS } from '../../core/mock';
import type { Location } from '../../core/models';
import { PageHeaderComponent } from '../../shared/components/page-header';
import { SectionCardComponent } from '../../shared/components/section-card';
import { StatCardComponent } from '../../shared/components/stat-card';
import { DataTableComponent, type TableColumn } from '../../shared/components/data-table';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon } from '@ng-icons/core';

interface TreeNode {
  location: Location;
  children: TreeNode[];
}

@Component({
  selector: 'app-locations',
  imports: [
    PageHeaderComponent,
    StatCardComponent,
    SectionCardComponent,
    DataTableComponent,
    HlmBadgeImports,
    HlmButtonImports,
    NgIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './locations.html',
})
export class LocationsComponent {
  protected readonly Math = Math;

  readonly tableColumns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo', type: 'status' },
    { key: 'activosCount', label: 'Activos', align: 'right', type: 'number' },
  ];

  readonly tableRows = computed(() =>
    MOCK_LOCATIONS.map((loc) => ({
      nombre: this.getFullName(loc),
      tipo: loc.tipo,
      activosCount: loc.activosCount,
    })),
  );

  readonly totalLocations = computed(() => MOCK_LOCATIONS.length);
  readonly totalAssets = computed(() =>
    MOCK_LOCATIONS.reduce((sum, loc) => sum + loc.activosCount, 0),
  );
  readonly plantasCount = computed(
    () => MOCK_LOCATIONS.filter((loc) => loc.tipo === 'planta').length,
  );
  readonly areasCount = computed(
    () => MOCK_LOCATIONS.filter((loc) => loc.tipo === 'área').length,
  );

  readonly tree = computed(() => this.buildTree(MOCK_LOCATIONS));

  private buildTree(locations: Location[]): TreeNode[] {
    const map = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    for (const loc of locations) {
      map.set(loc.id, { location: loc, children: [] });
    }

    for (const loc of locations) {
      const node = map.get(loc.id)!;
      if (loc.parentId) {
        map.get(loc.parentId)?.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  private getFullName(loc: Location): string {
    if (!loc.parentId) return loc.nombre;
    const parent = MOCK_LOCATIONS.find((p) => p.id === loc.parentId);
    if (!parent) return loc.nombre;
    if (!parent.parentId) return `${parent.nombre} → ${loc.nombre}`;
    const grandparent = MOCK_LOCATIONS.find((p) => p.id === parent.parentId);
    return grandparent
      ? `${grandparent.nombre} → ${parent.nombre} → ${loc.nombre}`
      : `${parent.nombre} → ${loc.nombre}`;
  }

  tipoLabel(tipo: string): string {
    const map: Record<string, string> = {
      planta: 'Planta',
      'área': 'Área',
      ubicación: 'Ubicación',
    };
    return map[tipo] ?? tipo;
  }

  tipoBadgeClass(tipo: string): string {
    if (tipo === 'planta') return 'bg-primary/10 text-primary border-primary/20';
    if (tipo === 'área') return 'bg-accent/10 text-accent-foreground border-accent/20';
    return 'bg-muted text-muted-foreground border-border';
  }

  indentClass(depth: number): string {
    return `ml-${depth * 6}`;
  }
}

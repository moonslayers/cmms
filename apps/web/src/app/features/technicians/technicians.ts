import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MOCK_TECHNICIANS } from '../../core/mock';
import { PageHeaderComponent } from '../../shared/components/page-header';
import { StatCardComponent } from '../../shared/components/stat-card';
import { SearchInputComponent } from '../../shared/components/search-input';
import { StatusBadgeComponent } from '../../shared/components/status-badge';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { EmptyStateComponent } from '../../shared/components/empty-state';

@Component({
  selector: 'app-technicians',
  imports: [
    PageHeaderComponent,
    StatCardComponent,
    SearchInputComponent,
    StatusBadgeComponent,
    EmptyStateComponent,
    HlmAvatarImports,
    HlmProgressImports,
    HlmBadgeImports,
    HlmButtonImports,
    TitleCasePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './technicians.html',
})
export class TechniciansComponent {
  protected readonly Math = Math;

  searchQuery = signal('');
  specialtyFilter = signal<string>('all');

  readonly specialties: { label: string; value: string }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Mecánico', value: 'mecánico' },
    { label: 'Electromecánico', value: 'electromecánico' },
    { label: 'Eléctrico', value: 'eléctrico' },
    { label: 'Instrumentación', value: 'instrumentación' },
    { label: 'Hidráulico', value: 'hidráulico' },
    { label: 'Refrigeración', value: 'refrigeración' },
    { label: 'Soldadura', value: 'soldadura' },
    { label: 'Automatización', value: 'automatización' },
  ];

  filteredTechnicians = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const spec = this.specialtyFilter();
    return MOCK_TECHNICIANS.filter((t) => {
      const matchesSearch =
        !q ||
        t.nombre.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.telefono.includes(q);
      const matchesSpec = spec === 'all' || t.especialidad === spec;
      return matchesSearch && matchesSpec;
    });
  });

  totalTecnicos = computed(() => MOCK_TECHNICIANS.length);
  disponibles = computed(
    () => MOCK_TECHNICIANS.filter((t) => t.disponibilidad === 'disponible').length,
  );
  ocupados = computed(
    () =>
      MOCK_TECHNICIANS.filter(
        (t) => t.disponibilidad === 'en_campo' || t.disponibilidad === 'no_disponible',
      ).length,
  );
  cargaMedia = computed(() => {
    const total = MOCK_TECHNICIANS.reduce((sum, t) => sum + t.cargaTrabajo, 0);
    return Math.round(total / MOCK_TECHNICIANS.length);
  });

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onSpecialtyChange(event: Event): void {
    this.specialtyFilter.set((event.target as HTMLSelectElement).value);
  }

  availabilityLabel(availability: string): string {
    const map: Record<string, string> = {
      disponible: 'Disponible',
      en_campo: 'En campo',
      no_disponible: 'No disponible',
    };
    return map[availability] ?? availability;
  }

  specialtyBadgeClass(specialty: string): string {
    const map: Record<string, string> = {
      mecánico: 'bg-muted text-muted-foreground border-border',
      electromecánico: 'bg-accent text-accent-foreground border-accent',
      eléctrico: 'bg-secondary text-secondary-foreground border-secondary',
      instrumentación: 'bg-primary/10 text-primary border-primary/20',
      hidráulico: 'bg-muted text-muted-foreground border-border',
      refrigeración: 'bg-secondary text-secondary-foreground border-secondary',
      soldadura: 'bg-destructive/10 text-destructive border-destructive/20',
      automatización: 'bg-accent text-accent-foreground border-accent',
    };
    return map[specialty] ?? 'bg-muted text-muted-foreground border-border';
  }
}

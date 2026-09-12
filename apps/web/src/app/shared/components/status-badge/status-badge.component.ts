import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';

interface StatusConfig {
  variant: BadgeVariant;
  dotClass: string;
}

const WORK_ORDER_MAP: Record<string, StatusConfig> = {
  abierta: { variant: 'secondary', dotClass: 'bg-muted-foreground' },
  pendiente: { variant: 'outline', dotClass: 'bg-warning' },
  en_progreso: { variant: 'default', dotClass: 'bg-primary' },
  completada: { variant: 'secondary', dotClass: 'bg-success' },
  cerrada: { variant: 'outline', dotClass: 'bg-muted-foreground' },
  cancelada: { variant: 'destructive', dotClass: 'bg-destructive' },
};

const PRIORITY_MAP: Record<string, StatusConfig> = {
  baja: { variant: 'outline', dotClass: 'bg-muted-foreground' },
  media: { variant: 'secondary', dotClass: 'bg-warning' },
  alta: { variant: 'default', dotClass: 'bg-primary' },
  critica: { variant: 'destructive', dotClass: 'bg-destructive' },
  urgente: { variant: 'destructive', dotClass: 'bg-destructive' },
};

const ASSET_MAP: Record<string, StatusConfig> = {
  operativo: { variant: 'secondary', dotClass: 'bg-success' },
  en_mantenimiento: { variant: 'outline', dotClass: 'bg-warning' },
  fuera_de_servicio: { variant: 'destructive', dotClass: 'bg-destructive' },
  dado_de_baja: { variant: 'outline', dotClass: 'bg-muted-foreground' },
};

const STOCK_MAP: Record<string, StatusConfig> = {
  disponible: { variant: 'secondary', dotClass: 'bg-success' },
  bajo: { variant: 'outline', dotClass: 'bg-warning' },
  agotado: { variant: 'destructive', dotClass: 'bg-destructive' },
  en_pedido: { variant: 'default', dotClass: 'bg-primary' },
};

@Component({
  selector: 'app-status-badge',
  imports: [HlmBadgeImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  templateUrl: './status-badge.component.html',
})
export class StatusBadgeComponent {
  status = input.required<string>();
  kind = input<'work-order' | 'priority' | 'asset' | 'stock' | 'generic'>('generic');

  private config = computed<StatusConfig>(() => {
    const s = this.status().toLowerCase().replace(/\s+/g, '_');
    const k = this.kind();
    const map =
      k === 'work-order'
        ? WORK_ORDER_MAP
        : k === 'priority'
          ? PRIORITY_MAP
          : k === 'asset'
            ? ASSET_MAP
            : k === 'stock'
              ? STOCK_MAP
              : null;
    return map?.[s] ?? { variant: 'outline', dotClass: 'bg-muted-foreground' };
  });

  badgeVariant = computed(() => this.config().variant);
  dotClass = computed(() => this.config().dotClass);

  displayLabel = computed(() => {
    const s = this.status();
    return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  });
}

import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight, lucideSearch } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'number' | 'status' | 'mono';
}

@Component({
  selector: 'app-data-table',
  imports: [
    HlmTableImports,
    HlmInputImports,
    HlmButtonImports,
    NgIcon,
    FormsModule,
    StatusBadgeComponent,
    EmptyStateComponent,
  ],
  providers: [provideIcons({ lucideSearch, lucideChevronLeft, lucideChevronRight })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
  templateUrl: './data-table.component.html',
})
export class DataTableComponent {
  protected readonly Math = Math;

  columns = input.required<TableColumn[]>();
  rows = input<Record<string, unknown>[]>([]);
  pageSize = input<number>(8);
  searchable = input<boolean>(true);
  searchPlaceholder = input<string>('Buscar...');

  searchQuery = signal('');
  currentPage = signal(1);

  filteredRows = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const all = this.rows();
    if (!q || !this.searchable()) return all;
    return all.filter((row) =>
      Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q)),
    );
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredRows().length / this.pageSize())));

  paginatedRows = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredRows().slice(start, start + this.pageSize());
  });

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  });

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    this.currentPage.set(Math.max(1, Math.min(page, this.totalPages())));
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  cellAlign(col: TableColumn): string {
    if (col.align === 'right') return 'text-right';
    if (col.align === 'center') return 'text-center';
    return 'text-start';
  }

  cellClass(col: TableColumn): string {
    const base = this.cellAlign(col);
    if (col.type === 'mono' || col.type === 'number') return `${base} font-mono tabular-nums`;
    return base;
  }

  toStr(val: unknown): string {
    return String(val ?? '');
  }
}

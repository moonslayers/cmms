import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

export interface Breadcrumb {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-page-header',
  imports: [RouterLink, NgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-1' },
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string>();
  breadcrumbs = input<Breadcrumb[]>();
}

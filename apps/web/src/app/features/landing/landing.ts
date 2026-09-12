import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
	selector: 'app-landing',
	standalone: true,
	templateUrl: './landing.html',
	imports: [RouterLink, NgIcon, HlmButtonImports, HlmCardImports, HlmBadgeImports, HlmSeparatorImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block' },
})
export default class LandingComponent {}

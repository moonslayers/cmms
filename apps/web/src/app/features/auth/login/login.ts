import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideBuilding2,
  lucideCircleCheck,
  lucideEye,
  lucideEyeOff,
  lucideLock,
  lucideMail,
  lucideUser,
} from '@ng-icons/lucide';
import { form, submit, required, email, minLength } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NgIcon,
    FormField,
    HlmButtonImports,
    HlmCardImports,
    HlmCheckboxImports,
    HlmFieldImports,
    HlmInputImports,
  ],
  providers: [
    provideIcons({
      lucideMail,
      lucideLock,
      lucideEye,
      lucideEyeOff,
      lucideArrowRight,
      lucideBuilding2,
      lucideCircleCheck,
      lucideUser,
    }),
  ],
  templateUrl: './login.html',
})
export default class LoginPage {
  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly rememberMe = signal(false);
  protected readonly loginError = signal(false);

  protected readonly model = signal({
    email: 'demo@mantia.app',
    password: 'mantia',
  });

  protected readonly loginForm = form(this.model, (p) => {
    required(p.email, { message: 'El correo es obligatorio.' });
    email(p.email, { message: 'Ingresa un correo válido.' });
    required(p.password, { message: 'La contraseña es obligatoria.' });
    minLength(p.password, 4, { message: 'La contraseña debe tener al menos 4 caracteres.' });
  });

  onSubmit() {
    submit(this.loginForm, async () => {
      this.loading.set(true);
      this.loginError.set(false);
      try {
        const ok = await this._auth.login(this.model().email, this.model().password);
        if (ok) {
          await this._router.navigate(['/app/dashboard']);
        } else {
          this.loginError.set(true);
        }
      } finally {
        this.loading.set(false);
      }
    });
  }
}

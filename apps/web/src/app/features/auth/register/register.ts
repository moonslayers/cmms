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
  lucideTriangleAlert,
  lucideUser,
} from '@ng-icons/lucide';
import { form, submit, required, email, minLength, validate } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
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
      lucideTriangleAlert,
    }),
  ],
  templateUrl: './register.html',
})
export default class RegisterPage {
  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly showConfirmPassword = signal(false);

  protected readonly model = signal({
    nombre: '',
    empresa: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  protected readonly registerForm = form(this.model, (p) => {
    required(p.nombre, { message: 'El nombre es obligatorio.' });
    required(p.empresa, { message: 'La empresa es obligatoria.' });
    required(p.email, { message: 'El correo es obligatorio.' });
    email(p.email, { message: 'Ingresa un correo válido.' });
    required(p.password, { message: 'La contraseña es obligatoria.' });
    minLength(p.password, 8, { message: 'La contraseña debe tener al menos 8 caracteres.' });
    required(p.confirmPassword, { message: 'Confirma tu contraseña.' });
    validate(p.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(p.password)) {
        return { kind: 'passwordMismatch', message: 'Las contraseñas no coinciden.' };
      }
      return undefined;
    });
    required(p.acceptTerms, { message: 'Debes aceptar los términos y condiciones.' });
  });

  onSubmit() {
    submit(this.registerForm, async () => {
      this.loading.set(true);
      try {
        const { nombre, empresa, email: e, password } = this.model();
        await this._auth.register({ nombre, empresa, email: e, password });
        await this._router.navigate(['/app/dashboard']);
      } finally {
        this.loading.set(false);
      }
    });
  }
}

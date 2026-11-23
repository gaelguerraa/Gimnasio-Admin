import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Sesion } from '../../servicios/sesion';
import { mensajeDeError } from '../../servicios/errores';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly sesion = inject(Sesion);
  private readonly router = inject(Router);

  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly formulario = this.fb.nonNullable.group({
    correo: ['admin@itson.mx', [Validators.required, Validators.email]],
    password: ['gimnasio2026', [Validators.required]],
  });

  protected entrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    const { correo, password } = this.formulario.getRawValue();
    this.sesion.iniciarSesion(correo, password).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/clases']);
      },
      error: (err: unknown) => {
        this.cargando.set(false);
        this.error.set(err instanceof Error ? err.message : mensajeDeError(err));
      },
    });
  }
}

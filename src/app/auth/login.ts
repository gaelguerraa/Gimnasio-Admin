import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Sesion } from './sesion';
import { mensajeHttp } from '../servicios/errores';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <main class="login">
      <form class="tarjeta" [formGroup]="formulario" (ngSubmit)="entrar()">
        <div class="login__marca"><img src="/logo.svg" alt="" /><div><h1>Gimnasio Titanes</h1><p>Panel de administración</p></div></div>
        @if (ruta.snapshot.queryParamMap.get('error') === 'rol') { <p class="aviso aviso--error">La cuenta inició sesión, pero no tiene permisos de administrador.</p> }
        @if (error(); as texto) { <p class="aviso aviso--error" role="alert">{{ texto }}</p> }
        <div class="campo"><label for="correo">Correo</label><input id="correo" type="email" formControlName="correo" autocomplete="username" />
          @if (formulario.controls.correo.touched && formulario.controls.correo.invalid) { <small class="error">Escribe un correo válido.</small> }
        </div>
        <div class="campo"><label for="password">Contraseña</label><input id="password" type="password" formControlName="password" autocomplete="current-password" />
          @if (formulario.controls.password.touched && formulario.controls.password.hasError('required')) { <small class="error">La contraseña es obligatoria.</small> }
        </div>
        <button class="boton" type="submit" [disabled]="guardando()">{{ guardando() ? 'Entrando…' : 'Iniciar sesión' }}</button>
        <p class="login__ayuda">Cuenta admin de práctica: admin&#64;itson.mx</p>
      </form>
    </main>
  `,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly sesion = inject(Sesion);
  private readonly router = inject(Router);
  readonly ruta = inject(ActivatedRoute);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly formulario = this.fb.nonNullable.group({
    correo: ['admin@itson.mx', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  entrar(): void {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid || this.guardando()) return;
    this.guardando.set(true);
    this.error.set(null);
    this.sesion.iniciar(this.formulario.controls.correo.value, this.formulario.controls.password.value).subscribe({
      next: () => { this.guardando.set(false); void this.router.navigateByUrl('/clases'); },
      error: (e: HttpErrorResponse) => { this.guardando.set(false); this.error.set(mensajeHttp(e)); },
    });
  }
}

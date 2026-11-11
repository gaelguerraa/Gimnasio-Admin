import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors, type ValidatorFn } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CATEGORIAS } from '../modelos/clase';
import type { ClaseNueva } from '../modelos/clase';

export const multiploDeCinco: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = Number(control.value);
  return Number.isFinite(valor) && valor % 5 === 0 ? null : { multiploDeCinco: true };
};

@Component({
  selector: 'app-formulario-clase',
  imports: [ReactiveFormsModule, RouterLink, JsonPipe],
  template: `
    <div class="encabezado"><div><h1>Nueva clase</h1><p>Completa los datos del catálogo.</p></div><a class="boton boton--secundario" routerLink="/clases">← Volver al catálogo</a></div>
    <form class="tarjeta formulario" [formGroup]="formulario" (ngSubmit)="guardar()" novalidate>
      <div class="campo"><label for="nombre">Nombre</label><input id="nombre" formControlName="nombre" maxlength="80" />
        @if (tocado('nombre') && formulario.controls.nombre.hasError('required')) { <small class="error">El nombre es obligatorio.</small> }
        @if (tocado('nombre') && formulario.controls.nombre.hasError('minlength')) { <small class="error">Escribe al menos 3 caracteres.</small> }
      </div>
      <div class="fila">
        <div class="campo"><label for="categoria">Categoría</label><select id="categoria" formControlName="categoria"><option value="">Selecciona una categoría</option>@for (categoria of categorias; track categoria) { <option [value]="categoria">{{ categoria }}</option> }</select>
          @if (tocado('categoria') && formulario.controls.categoria.hasError('required')) { <small class="error">Selecciona una categoría.</small> }
        </div>
        <div class="campo"><label for="duracionMin">Duración (minutos)</label><input id="duracionMin" type="number" min="10" max="180" step="5" formControlName="duracionMin" />
          @if (tocado('duracionMin') && formulario.controls.duracionMin.hasError('required')) { <small class="error">La duración es obligatoria.</small> }
          @if (tocado('duracionMin') && (formulario.controls.duracionMin.hasError('min') || formulario.controls.duracionMin.hasError('max'))) { <small class="error">La duración debe ser de 10 a 180 minutos.</small> }
          @if (tocado('duracionMin') && formulario.controls.duracionMin.hasError('multiploDeCinco')) { <small class="error">La duración debe avanzar en bloques de 5 minutos.</small> }
        </div>
      </div>
      <div class="campo"><label for="descripcion">Descripción</label><textarea id="descripcion" rows="4" maxlength="300" formControlName="descripcion"></textarea>
        @if (tocado('descripcion') && formulario.controls.descripcion.hasError('required')) { <small class="error">La descripción es obligatoria.</small> }
        @if (tocado('descripcion') && formulario.controls.descripcion.hasError('minlength')) { <small class="error">Escribe al menos 10 caracteres.</small> }
      </div>
      <div class="campo"><label for="imagen">Ruta de imagen (servida por la API)</label><input id="imagen" placeholder="/img/clase-01.jpg" formControlName="imagen" />
        @if (tocado('imagen') && formulario.controls.imagen.hasError('required')) { <small class="error">La ruta de imagen es obligatoria.</small> }
        @if (tocado('imagen') && formulario.controls.imagen.hasError('pattern')) { <small class="error">Usa una ruta que empiece con /img/.</small> }
      </div>
      <button class="boton" type="submit">Guardar clase</button>
      @if (enviado(); as clase) { <section class="aviso aviso--exito" aria-live="polite"><strong>Objeto preparado para la API (sin enviar):</strong><pre>{{ clase | json }}</pre></section> }
    </form>
  `,
})
export class FormularioClase {
  private readonly fb = inject(FormBuilder);
  readonly categorias = CATEGORIAS;
  readonly enviado = signal<ClaseNueva | null>(null);
  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    categoria: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
    duracionMin: [45, [Validators.required, Validators.min(10), Validators.max(180), multiploDeCinco]],
    imagen: ['', [Validators.required, Validators.pattern(/^\/img\/.+\.(jpg|jpeg|png|webp)$/i)]],
  });

  tocado(campo: keyof typeof this.formulario.controls): boolean { return this.formulario.controls[campo].touched; }
  guardar() {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) { this.enviado.set(null); return; }
    const valor = this.formulario.getRawValue();
    this.enviado.set({ ...valor, categoria: valor.categoria as ClaseNueva['categoria'], duracionMin: Number(valor.duracionMin) });
  }
}

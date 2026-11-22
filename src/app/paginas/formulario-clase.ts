import { Component, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors, type ValidatorFn } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CATEGORIAS, type ClaseNueva } from '../modelos/clase';
import { ClasesApi } from '../servicios/clases-api';
import { Catalogo } from '../servicios/catalogo';
import { mensajeHttp } from '../servicios/errores';
import type { FormularioConCambios } from '../auth/cambios-sin-guardar.guard';

export const multiploDeCinco: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = Number(control.value);
  return Number.isFinite(valor) && valor % 5 === 0 ? null : { multiploDeCinco: true };
};

@Component({
  selector: 'app-formulario-clase',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="encabezado"><div><h1>{{ editando() ? 'Editar clase' : 'Nueva clase' }}</h1><p>Completa los datos del catálogo.</p></div><a class="boton boton--secundario" routerLink="/clases">← Volver al catálogo</a></div>
    @if (cargando()) { <p class="cargando">Cargando clase…</p> }
    @if (error(); as texto) { <p class="aviso aviso--error" role="alert">{{ texto }}</p> }
    @if (!cargando()) {
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
        <div class="campo"><label for="descripcion">Descripción</label><textarea id="descripcion" rows="4" maxlength="255" formControlName="descripcion"></textarea>
          @if (tocado('descripcion') && formulario.controls.descripcion.hasError('required')) { <small class="error">La descripción es obligatoria.</small> }
          @if (tocado('descripcion') && formulario.controls.descripcion.hasError('minlength')) { <small class="error">Escribe al menos 10 caracteres.</small> }
        </div>
        <div class="campo"><label for="imagen">Ruta de imagen (servida por la API)</label><input id="imagen" placeholder="/img/clase-01.jpg" formControlName="imagen" />
          @if (tocado('imagen') && formulario.controls.imagen.hasError('required')) { <small class="error">La ruta de imagen es obligatoria.</small> }
          @if (tocado('imagen') && formulario.controls.imagen.hasError('pattern')) { <small class="error">Usa una ruta que empiece con /img/.</small> }
        </div>
        <div class="acciones">
          <button class="boton" type="submit" [disabled]="guardando() || formulario.invalid || cargando()">{{ guardando() ? 'Guardando…' : (editando() ? 'Guardar cambios' : 'Guardar clase') }}</button>
          @if (editando()) { <button class="boton boton--peligro" type="button" [disabled]="guardando()" (click)="eliminar()">Eliminar clase</button> }
        </div>
      </form>
    }
  `,
})
export class FormularioClase implements FormularioConCambios {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ClasesApi);
  private readonly catalogo = inject(Catalogo);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);
  readonly id = input<string | undefined>();
  readonly categorias = CATEGORIAS;
  readonly editando = signal(false);
  readonly guardando = signal(false);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    categoria: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
    duracionMin: [45, [Validators.required, Validators.min(10), Validators.max(180), multiploDeCinco]],
    imagen: ['', [Validators.required, Validators.pattern(/^\/img\/.+\.(jpg|jpeg|png|webp)$/i)]],
  });

  ngOnInit(): void {
    const rawId = this.id();
    if (!rawId) return;
    const id = Number(rawId);
    this.editando.set(true);
    this.cargando.set(true);
    this.api.obtener(id).subscribe({
      next: (clase) => {
        this.formulario.patchValue({
          nombre: clase.nombre,
          categoria: clase.categoria,
          descripcion: clase.descripcion,
          duracionMin: clase.duracionMin,
          imagen: clase.imagen,
        });
        this.formulario.markAsPristine();
        this.cargando.set(false);
      },
      error: (e: HttpErrorResponse) => { this.error.set(mensajeHttp(e)); this.cargando.set(false); },
    });
  }

  tocado(campo: keyof typeof this.formulario.controls): boolean { return this.formulario.controls[campo].touched; }
  tieneCambiosSinGuardar(): boolean { return this.formulario.dirty && !this.guardando(); }

  guardar(): void {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid || this.guardando()) return;
    const valor = this.formulario.getRawValue();
    const payload: ClaseNueva = {
      ...valor,
      categoria: valor.categoria as ClaseNueva['categoria'],
      duracionMin: Number(valor.duracionMin),
    };
    this.guardando.set(true);
    this.error.set(null);
    const peticion = this.id() ? this.api.actualizar(Number(this.id()), payload) : this.api.crear(payload);
    peticion.subscribe({
      next: () => {
        this.formulario.markAsPristine();
        this.catalogo.recargar();
        void this.router.navigateByUrl('/clases');
      },
      error: (e: HttpErrorResponse) => { this.error.set(mensajeHttp(e)); this.guardando.set(false); },
    });
  }

  eliminar(): void {
    const id = Number(this.id());
    if (!id || !window.confirm('¿Eliminar esta clase? También se borrarán sus horarios e inscripciones.')) return;
    this.guardando.set(true);
    this.error.set(null);
    this.api.eliminar(id).subscribe({
      next: () => {
        this.formulario.markAsPristine();
        this.catalogo.recargar();
        void this.router.navigateByUrl('/clases');
      },
      error: (e: HttpErrorResponse) => { this.error.set(mensajeHttp(e)); this.guardando.set(false); },
    });
  }
}

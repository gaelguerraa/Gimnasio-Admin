import { Component, computed, effect, inject, input, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { API_URL } from '../../config';
import { CATEGORIAS, type Categoria } from '../../modelos/clase';
import { ClasesApi } from '../../servicios/clases-api';
import { Catalogo } from '../../servicios/catalogo';
import { mensajeDeError } from '../../servicios/errores';
import type { PuedeSalir } from '../../guardias/cambios-sin-guardar.guard';

function multiplosDeCinco(control: AbstractControl): ValidationErrors | null {
  if (control.value === null || control.value === '') return null;
  const numero = Number(control.value);
  return Number.isFinite(numero) && numero % 5 === 0 ? null : { multiploDeCinco: true };
}

@Component({
  selector: 'app-formulario-clase',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-clase.html',
})
export class FormularioClase implements PuedeSalir {
  private readonly fb = inject(FormBuilder);
  private readonly clasesApi = inject(ClasesApi);
  private readonly catalogo = inject(Catalogo);
  private readonly router = inject(Router);

  readonly id = input<string>();

  protected readonly categorias = CATEGORIAS;
  protected readonly esEdicion = computed(() => Boolean(this.id()));
  protected readonly guardando = signal(false);
  protected readonly cargandoClase = signal(false);
  protected readonly errorServidor = signal<string | null>(null);

  private guardadoExitoso = false;

  protected readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    categoria: ['fuerza' as Categoria, [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
    duracionMin: [45, [Validators.required, Validators.min(15), Validators.max(180), multiplosDeCinco]],
    imagen: ['/img/clase-01.jpg', [Validators.required, Validators.pattern(/^\/img\/.+\.(jpg|jpeg|png|webp)$/i)]],
  });

  constructor() {
    effect(() => {
      const idActual = this.id();
      if (!idActual) return;

      this.cargandoClase.set(true);
      this.errorServidor.set(null);

      this.clasesApi.obtener(Number(idActual)).subscribe({
        next: (res) => {
          const clase = res.data;
          this.formulario.patchValue({
            nombre: clase.nombre,
            categoria: clase.categoria,
            descripcion: clase.descripcion,
            duracionMin: clase.duracionMin,
            imagen: clase.imagen,
          });
          this.formulario.markAsPristine();
          this.cargandoClase.set(false);
        },
        error: (err: unknown) => {
          this.cargandoClase.set(false);
          this.errorServidor.set(mensajeDeError(err));
        },
      });
    });
  }

  protected urlPrevia(): string {
    const ruta = this.formulario.controls.imagen.value;
    return ruta.startsWith('http') ? ruta : `${API_URL}${ruta}`;
  }

  protected guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.errorServidor.set(null);

    const datos = this.formulario.getRawValue();
    const idActual = this.id();
    const peticion = idActual
      ? this.clasesApi.actualizar(Number(idActual), datos)
      : this.clasesApi.crear(datos);

    peticion.subscribe({
      next: () => {
        this.guardadoExitoso = true;
        this.formulario.markAsPristine();
        this.guardando.set(false);
        this.catalogo.recargar();
        this.router.navigate(['/clases']);
      },
      error: (err: unknown) => {
        this.guardando.set(false);
        this.errorServidor.set(mensajeDeError(err));
      },
    });
  }

  tieneCambiosSinGuardar(): boolean {
    return this.formulario.dirty && !this.guardadoExitoso;
  }
}

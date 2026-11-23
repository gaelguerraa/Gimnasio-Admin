import { Component, effect, inject, input, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClasesApi } from '../../servicios/clases-api';
import { mensajeDeError } from '../../servicios/errores';
import { API_URL } from '../../config';
import type { ClaseConHorarios } from '../../modelos/clase';

@Component({
  selector: 'app-detalle-clase',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './detalle-clase.html',
})
export class DetalleClase {
  private readonly clasesApi = inject(ClasesApi);

  readonly id = input.required<string>();

  protected readonly clase = signal<ClaseConHorarios | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const idNum = Number(this.id());
      this.cargando.set(true);
      this.error.set(null);

      this.clasesApi.obtener(idNum).subscribe({
        next: (res) => {
          this.clase.set(res.data);
          this.cargando.set(false);
        },
        error: (err: unknown) => {
          this.error.set(mensajeDeError(err));
          this.cargando.set(false);
        },
      });
    });
  }

  protected urlImagen(ruta: string): string {
    return ruta.startsWith('http') ? ruta : `${API_URL}${ruta}`;
  }
}

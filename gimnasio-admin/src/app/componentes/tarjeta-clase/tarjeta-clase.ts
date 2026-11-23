import { TitleCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { API_URL } from '../../config';
import type { Clase } from '../../modelos/clase';

@Component({
  selector: 'app-tarjeta-clase',
  imports: [TitleCasePipe],
  templateUrl: './tarjeta-clase.html',
  styleUrl: './tarjeta-clase.css',
})
export class TarjetaClase {
  readonly clase = input.required<Clase>();
  readonly activa = input(false);
  readonly seleccionar = output<Clase>();

  protected urlImagen(ruta: string): string {
    return ruta.startsWith('http') ? ruta : `${API_URL}${ruta}`;
  }
}

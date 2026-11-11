import { Component, input, output } from '@angular/core';
import type { Clase } from '../modelos/clase';
import { API_URL } from '../config';

@Component({
  selector: 'app-tarjeta-clase',
  templateUrl: './tarjeta-clase.html',
  styleUrl: './tarjeta-clase.css',
})
export class TarjetaClase {
  // La clase es obligatoria: el padre siempre tiene que mandarla
  clase = input.required<Clase>();
  activa = input(false);
  seleccionada = output<Clase>();
  imagenUrl(ruta: string): string { return new URL(ruta, API_URL).toString(); }
}

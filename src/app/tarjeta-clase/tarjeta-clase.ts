import { Component, input } from '@angular/core';
import type { Clase } from '../modelos/clase';

@Component({
  selector: 'app-tarjeta-clase',
  templateUrl: './tarjeta-clase.html',
  styleUrl: './tarjeta-clase.css',
})
export class TarjetaClase {
  // La clase es obligatoria: el padre siempre tiene que mandarla
  clase = input.required<Clase>();
}

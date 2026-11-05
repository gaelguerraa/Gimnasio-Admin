import { Component, computed, signal } from '@angular/core';
import { CLASES_LOCALES } from './datos/clases-locales';
import type { Clase } from './modelos/clase';
import { TarjetaClase } from './tarjeta-clase/tarjeta-clase';

@Component({
  selector: 'app-root',
  imports: [TarjetaClase],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  clases = signal<Clase[]>(CLASES_LOCALES);

  totalClases = computed(() => this.clases().length);

  minutosSemana = computed(() =>
    this.clases().reduce((suma, c) => suma + c.duracionMin, 0),
  );

  clasesLargas = computed(
    () => this.clases().filter((c) => c.duracionMin >= 60).length,
  );

  vaciar() {
    this.clases.set([]);
  }

  restaurar() {
    this.clases.set(CLASES_LOCALES);
  }
}

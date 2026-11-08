import { Component, computed, inject } from '@angular/core';
import { Catalogo } from './servicios/catalogo';
import { FiltroCategoria } from './filtro-categoria/filtro-categoria';
import { TarjetaClase } from './tarjeta-clase/tarjeta-clase';

@Component({
  selector: 'app-root',
  imports: [TarjetaClase, FiltroCategoria],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly catalogo = inject(Catalogo);
  totalClases = computed(() => this.catalogo.clases().length);

  clasesLargas = computed(
    () => this.catalogo.clases().filter((c) => c.duracionMin >= 60).length,
  );

  vaciar() {
    this.catalogo.vaciar();
  }

  restaurar() {
    this.catalogo.restaurar();
  }
}

import { computed, Injectable, signal } from '@angular/core';
import { CLASES_LOCALES } from '../datos/clases-locales';
import type { Categoria, Clase } from '../modelos/clase';

export type FiltroCategoria = Categoria | 'todas';

@Injectable({ providedIn: 'root' })
export class Catalogo {
  readonly clases = signal<Clase[]>(CLASES_LOCALES);
  readonly categoriaElegida = signal<FiltroCategoria>('todas');
  readonly claseSeleccionada = signal<Clase | null>(null);
  readonly clasesVisibles = computed(() => {
    const categoria = this.categoriaElegida();
    return categoria === 'todas' ? this.clases() : this.clases().filter((clase) => clase.categoria === categoria);
  });
  readonly minutosVisibles = computed(() => this.clasesVisibles().reduce((total, clase) => total + clase.duracionMin, 0));

  elegirCategoria(categoria: FiltroCategoria) {
    this.categoriaElegida.set(categoria);
    const seleccionada = this.claseSeleccionada();
    if (seleccionada && !this.clasesVisibles().some((clase) => clase.id === seleccionada.id)) this.claseSeleccionada.set(null);
  }

  seleccionarClase(clase: Clase | null) { this.claseSeleccionada.set(clase); }
  vaciar() { this.clases.set([]); this.claseSeleccionada.set(null); }
  restaurar() { this.clases.set(CLASES_LOCALES); this.claseSeleccionada.set(null); }
}

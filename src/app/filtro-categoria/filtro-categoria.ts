import { Component, inject } from '@angular/core';
import { CATEGORIAS } from '../modelos/clase';
import { Catalogo } from '../servicios/catalogo';

@Component({
  selector: 'app-filtro-categoria',
  template: `
    <nav class="filtro" aria-label="Filtrar clases por categoría">
      <button type="button" [class.activo]="catalogo.categoriaElegida() === 'todas'" (click)="catalogo.elegirCategoria('todas')">Todas</button>
      @for (categoria of categorias; track categoria) {
        <button type="button" [class.activo]="catalogo.categoriaElegida() === categoria" (click)="catalogo.elegirCategoria(categoria)">{{ categoria }}</button>
      }
    </nav>
  `,
  styles: `
    .filtro { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1rem 0; }
    button { border: 1px solid #d0d5dd; border-radius: 999px; padding: .55rem 1rem; background: white; color: #344054; cursor: pointer; text-transform: capitalize; }
    button.activo { background: #174c3c; border-color: #174c3c; color: white; }
  `,
})
export class FiltroCategoria {
  readonly catalogo = inject(Catalogo);
  readonly categorias = CATEGORIAS;
}

import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Catalogo } from '../servicios/catalogo';
import { FiltroCategoria } from '../filtro-categoria/filtro-categoria';
import { TarjetaClase } from '../tarjeta-clase/tarjeta-clase';
import { mensajeError } from '../servicios/errores';

@Component({
  selector: 'app-lista-clases',
  imports: [TarjetaClase, FiltroCategoria, RouterLink],
  template: `
    <div class="encabezado">
      <div><h1>Tablero</h1><p>Resumen del catálogo de clases</p></div>
      <a class="boton" routerLink="/clases/nueva">+ Nueva clase</a>
    </div>
    @if (catalogo.cargando()) { <p class="cargando">Cargando catálogo…</p> }
    @if (catalogo.error(); as error) { <p class="aviso aviso--error">{{ mensaje(error) }}</p> }
    @if (!catalogo.cargando() && !catalogo.error()) {
      <section class="resumen">
        <div class="resumen__dato"><span class="resumen__numero">{{ totalClases() }}</span><span class="resumen__texto">Clases en total</span></div>
        <div class="resumen__dato"><span class="resumen__numero">{{ catalogo.minutosVisibles() }}</span><span class="resumen__texto">Minutos visibles</span></div>
        <div class="resumen__dato"><span class="resumen__numero">{{ clasesLargas() }}</span><span class="resumen__texto">Clases de una hora o más</span></div>
      </section>
      <app-filtro-categoria />
      <div class="contenido-tablero" [class.con-detalle]="catalogo.claseSeleccionada() !== null">
        <section class="rejilla">
          @for (c of catalogo.clasesVisibles(); track c.id) {
            <app-tarjeta-clase [clase]="c" [activa]="catalogo.claseSeleccionada()?.id === c.id" (seleccionada)="catalogo.seleccionarClase($event)" />
          } @empty { <p class="vacio">No hay clases para esta categoría.</p> }
        </section>
        @if (catalogo.claseSeleccionada(); as clase) {
          <aside class="detalle" aria-live="polite">
            <button class="detalle__cerrar" type="button" aria-label="Cerrar detalle" (click)="catalogo.seleccionarClase(null)">×</button>
            <img [src]="catalogo.imagenUrl(clase.imagen)" [alt]="clase.nombre" />
            <h2>{{ clase.nombre }}</h2><p>{{ clase.descripcion }}</p>
            <p><strong>Categoría:</strong> {{ clase.categoria }}</p><p><strong>Duración:</strong> {{ clase.duracionMin }} minutos</p>
          </aside>
        }
      </div>
    }
  `,
  styles: `.contenido-tablero{display:grid;grid-template-columns:minmax(0,1fr);gap:1.25rem;align-items:start}.contenido-tablero.con-detalle{grid-template-columns:minmax(0,1fr) 300px}.detalle{position:sticky;top:1rem;padding:1.25rem;border:1px solid #e4e7ec;border-radius:1rem;background:white;box-shadow:0 4px 16px #10182812}.detalle>img{width:100%;max-height:180px;object-fit:cover;border-radius:.75rem}.detalle__cerrar{float:right;border:0;background:transparent;font-size:1.5rem;cursor:pointer}@media(max-width:900px){.contenido-tablero.con-detalle{grid-template-columns:1fr}.detalle{position:static}}`,
})
export class ListaClases {
  readonly catalogo = inject(Catalogo);
  readonly totalClases = computed(() => this.catalogo.clases().length);
  readonly clasesLargas = computed(() => this.catalogo.clases().filter((c) => c.duracionMin >= 60).length);
  readonly mensaje = mensajeError;
}

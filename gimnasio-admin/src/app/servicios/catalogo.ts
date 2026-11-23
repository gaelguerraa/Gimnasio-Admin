import { Injectable, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { ClasesApi } from './clases-api';
import { mensajeDeError } from './errores';
import type { Categoria, Clase } from '../modelos/clase';

interface EstadoCatalogo {
  clases: Clase[];
  cargando: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class Catalogo {
  private readonly clasesApi = inject(ClasesApi);
  private readonly consulta$ = new BehaviorSubject<string>('');

  private readonly estado = toSignal(
    this.consulta$.pipe(
      switchMap((termino) =>
        this.clasesApi.listar(termino).pipe(
          map(
            (res): EstadoCatalogo => ({
              clases: res.data,
              cargando: false,
              error: null,
            }),
          ),
          catchError((err: unknown) =>
            of<EstadoCatalogo>({
              clases: [],
              cargando: false,
              error: mensajeDeError(err),
            }),
          ),
          startWith<EstadoCatalogo>({
            clases: [],
            cargando: true,
            error: null,
          }),
        ),
      ),
    ),
    {
      initialValue: { clases: [], cargando: true, error: null },
    },
  );

  private readonly listaClases = computed<Clase[]>(() => this.estado().clases);

  readonly cargando = computed(() => this.estado().cargando);
  readonly error = computed(() => this.estado().error);

  readonly terminoBusqueda = signal<string>('');
  readonly categoriaActiva = signal<Categoria | 'todas'>('todas');
  readonly claseActiva = signal<Clase | null>(null);

  readonly clasesFiltradas = computed(() => {
    const actual = this.categoriaActiva();
    const todas = this.listaClases();
    return actual === 'todas' ? todas : todas.filter((item) => item.categoria === actual);
  });

  readonly totalMinutos = computed(() =>
    this.clasesFiltradas().reduce((acum, item) => acum + item.duracionMin, 0),
  );

  buscar(termino: string): void {
    const limpio = termino.trim();
    this.terminoBusqueda.set(limpio);
    this.consulta$.next(limpio);
  }

  cambiarCategoria(categoria: Categoria | 'todas'): void {
    this.categoriaActiva.set(categoria);

    const seleccionada = this.claseActiva();
    if (seleccionada && categoria !== 'todas' && seleccionada.categoria !== categoria) {
      this.claseActiva.set(null);
    }
  }

  alternarSeleccion(clase: Clase): void {
    this.claseActiva.update((previa) => (previa?.id === clase.id ? null : clase));
  }

  recargar(): void {
    this.consulta$.next(this.consulta$.getValue());
  }
}

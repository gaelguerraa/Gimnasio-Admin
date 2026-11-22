import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { API_URL } from '../config';
import type { Clase, ClaseConHorarios, ClaseNueva, Sobre } from '../modelos/clase';

@Injectable({ providedIn: 'root' })
export class ClasesApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_URL}/clases`;

  obtener(id: number) {
    return this.http.get<Sobre<ClaseConHorarios>>(`${this.base}/${id}`).pipe(map((r) => r.data));
  }
  crear(clase: ClaseNueva) {
    return this.http.post<Sobre<Clase>>(`${this.base}`, clase).pipe(map((r) => r.data));
  }
  actualizar(id: number, clase: ClaseNueva) {
    return this.http.patch<Sobre<Clase>>(`${this.base}/${id}`, clase).pipe(map((r) => r.data));
  }
  eliminar(id: number) {
    return this.http.delete<Sobre<Clase>>(`${this.base}/${id}`).pipe(map((r) => r.data));
  }
}

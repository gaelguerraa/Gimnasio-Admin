import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { API_URL } from '../config';
import type { RespuestaToken, Sobre, Usuario } from '../modelos/clase';

const CLAVE_TOKEN = 'arena_fit_token';
const CLAVE_USUARIO = 'arena_fit_usuario';

function leerUsuario(): Usuario | null {
  try {
    const raw = localStorage.getItem(CLAVE_USUARIO);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class Sesion {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(localStorage.getItem(CLAVE_TOKEN));
  private readonly _usuario = signal<Usuario | null>(leerUsuario());

  readonly token = this._token.asReadonly();
  readonly usuario = this._usuario.asReadonly();
  readonly estaAutenticado = computed(() => Boolean(this._token() && this._usuario()));
  readonly esAdmin = computed(() => this._usuario()?.rol === 'admin');

  iniciarSesion(correo: string, password: string): Observable<Usuario> {
    return this.http
      .post<Sobre<RespuestaToken>>(`${API_URL}/auth/login`, { correo, password })
      .pipe(
        map((res) => {
          const payload = res.data;
          if (payload.usuario.rol !== 'admin') {
            throw new Error(
              `Acceso denegado: la cuenta "${payload.usuario.correo}" tiene rol "${payload.usuario.rol}" y se requiere administrador.`,
            );
          }
          localStorage.setItem(CLAVE_TOKEN, payload.access_token);
          localStorage.setItem(CLAVE_USUARIO, JSON.stringify(payload.usuario));
          this._token.set(payload.access_token);
          this._usuario.set(payload.usuario);
          return payload.usuario;
        }),
      );
  }

  salir(): void {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    this._token.set(null);
    this._usuario.set(null);
    this.router.navigate(['/login']);
  }
}

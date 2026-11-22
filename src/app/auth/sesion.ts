import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from '../config';
import type { Usuario } from '../modelos/clase';

interface LoginResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  usuario: Usuario;
}
interface Sobre<T> { data: T; meta: unknown; }

@Injectable({ providedIn: 'root' })
export class Sesion {
  private readonly claveToken = 'gimnasio_token';
  private readonly claveUsuario = 'gimnasio_usuario';
  readonly usuario = signal<Usuario | null>(this.leerUsuario());
  readonly token = () => localStorage.getItem(this.claveToken);

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  iniciar(correo: string, password: string) {
    return this.http.post<Sobre<LoginResponse>>(`${API_URL}/auth/login`, { correo, password }).pipe(
      tap(({ data: respuesta }) => {
        localStorage.setItem(this.claveToken, respuesta.access_token);
        localStorage.setItem(this.claveUsuario, JSON.stringify(respuesta.usuario));
        this.usuario.set(respuesta.usuario);
      }),
    );
  }

  salir(): void {
    localStorage.removeItem(this.claveToken);
    localStorage.removeItem(this.claveUsuario);
    this.usuario.set(null);
    void this.router.navigateByUrl('/login');
  }

  esAdmin(): boolean { return this.usuario()?.rol === 'admin' && !!this.token(); }

  private leerUsuario(): Usuario | null {
    try {
      const valor = localStorage.getItem(this.claveUsuario);
      return valor ? JSON.parse(valor) as Usuario : null;
    } catch {
      return null;
    }
  }
}

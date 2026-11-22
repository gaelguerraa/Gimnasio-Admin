import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Sesion } from './auth/sesion';

@Component({
  selector: 'app-panel',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="barra"><div class="barra__interior">
      <a class="barra__marca" routerLink="/clases"><img src="/logo.svg" alt="" /> Gimnasio Titanes</a>
      <span class="barra__etiqueta">Panel de administración</span>
      <nav class="barra__enlaces" aria-label="Navegación principal">
        <a class="barra__enlace" routerLink="/clases" routerLinkActive="barra__enlace--activo" [routerLinkActiveOptions]="{ exact: true }">Clases</a>
        <a class="barra__enlace" routerLink="/horarios" routerLinkActive="barra__enlace--activo">Horarios</a>
        <a class="barra__enlace" routerLink="/miembros" routerLinkActive="barra__enlace--activo">Miembros</a>
      </nav>
      <span class="barra__quien">{{ sesion.usuario()?.nombre }}</span>
      <button class="boton boton--secundario boton--chico" type="button" (click)="sesion.salir()">Salir</button>
    </div></header>
    <main class="pagina"><router-outlet /></main>
  `,
})
export class Panel { readonly sesion = inject(Sesion); }

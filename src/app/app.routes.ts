import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'clases/nueva', loadComponent: () => import('./paginas/formulario-clase').then((m) => m.FormularioClase) },
  { path: 'clases', loadComponent: () => import('./paginas/lista-clases').then((m) => m.ListaClases) },
  { path: 'horarios', loadComponent: () => import('./paginas/horarios').then((m) => m.Horarios) },
  { path: 'miembros', loadComponent: () => import('./paginas/miembros').then((m) => m.Miembros) },
  { path: '', redirectTo: '/clases', pathMatch: 'full' },
  { path: '**', redirectTo: '/clases' },
];

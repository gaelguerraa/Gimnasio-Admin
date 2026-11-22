import { Routes } from '@angular/router';
import { soloAdminGuard, loginGuard } from './auth/guards';
import { cambiosSinGuardarGuard } from './auth/cambios-sin-guardar.guard';

export const routes: Routes = [
  { path: 'login', canActivate: [loginGuard], loadComponent: () => import('./auth/login').then((m) => m.Login) },
  {
    path: '',
    canActivateChild: [soloAdminGuard],
    loadComponent: () => import('./panel').then((m) => m.Panel),
    children: [
      { path: 'clases/nueva', canDeactivate: [cambiosSinGuardarGuard], loadComponent: () => import('./paginas/formulario-clase').then((m) => m.FormularioClase) },
      { path: 'clases/:id/editar', canDeactivate: [cambiosSinGuardarGuard], loadComponent: () => import('./paginas/formulario-clase').then((m) => m.FormularioClase) },
      { path: 'clases', loadComponent: () => import('./paginas/lista-clases').then((m) => m.ListaClases) },
      { path: 'horarios', loadComponent: () => import('./paginas/horarios').then((m) => m.Horarios) },
      { path: 'miembros', loadComponent: () => import('./paginas/miembros').then((m) => m.Miembros) },
      { path: '', redirectTo: 'clases', pathMatch: 'full' },
      { path: '**', redirectTo: 'clases' },
    ],
  },
];

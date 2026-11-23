import { Routes } from '@angular/router';
import { Panel } from './componentes/panel/panel';
import { ListaClases } from './paginas/lista-clases/lista-clases';
import { Horarios } from './paginas/horarios/horarios';
import { Miembros } from './paginas/miembros/miembros';
import { adminGuard } from './guardias/admin.guard';
import { cambiosSinGuardarGuard } from './guardias/cambios-sin-guardar.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./paginas/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: Panel,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'clases', pathMatch: 'full' },
      { path: 'clases', component: ListaClases },
      {
        path: 'clases/nueva',
        canDeactivate: [cambiosSinGuardarGuard],
        loadComponent: () =>
          import('./paginas/formulario-clase/formulario-clase').then((m) => m.FormularioClase),
      },
      {
        path: 'clases/:id/editar',
        canDeactivate: [cambiosSinGuardarGuard],
        loadComponent: () =>
          import('./paginas/formulario-clase/formulario-clase').then((m) => m.FormularioClase),
      },
      {
        path: 'clases/:id',
        loadComponent: () =>
          import('./paginas/detalle-clase/detalle-clase').then((m) => m.DetalleClase),
      },
      { path: 'horarios', component: Horarios },
      { path: 'miembros', component: Miembros },
    ],
  },
  { path: '**', redirectTo: 'clases' },
];

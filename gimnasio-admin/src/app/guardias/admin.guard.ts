import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Sesion } from '../servicios/sesion';

export const adminGuard: CanActivateFn = () => {
  const sesion = inject(Sesion);
  const router = inject(Router);
  if (sesion.estaAutenticado() && sesion.esAdmin()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { Sesion } from './sesion';

export const soloAdminGuard: CanActivateChildFn = () => {
  const sesion = inject(Sesion);
  const router = inject(Router);
  return sesion.esAdmin() ? true : router.createUrlTree(['/login'], {
    queryParams: { error: sesion.usuario() ? 'rol' : 'sesion' },
  });
};

export const loginGuard: CanActivateFn = () => {
  const sesion = inject(Sesion);
  return sesion.esAdmin() ? inject(Router).createUrlTree(['/clases']) : true;
};

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Sesion } from '../servicios/sesion';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(Sesion).token();
  if (!token) {
    return next(req);
  }

  const reqConToken = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return next(reqConToken);
};

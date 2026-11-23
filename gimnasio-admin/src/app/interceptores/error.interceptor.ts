import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Sesion } from '../servicios/sesion';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const sesion = inject(Sesion);
  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401 && !req.url.includes('/auth/login')) {
        sesion.salir();
      }
      return throwError(() => err);
    }),
  );
};

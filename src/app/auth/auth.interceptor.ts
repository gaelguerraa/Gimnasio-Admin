import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL } from '../config';
import { Sesion } from './sesion';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(Sesion).token();
  if (!token || !req.url.startsWith(API_URL)) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};

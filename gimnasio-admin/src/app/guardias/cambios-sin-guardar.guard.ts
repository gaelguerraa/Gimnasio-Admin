import { CanDeactivateFn } from '@angular/router';

export interface PuedeSalir {
  tieneCambiosSinGuardar(): boolean;
}

export const cambiosSinGuardarGuard: CanDeactivateFn<PuedeSalir> = (componente) => {
  if (componente.tieneCambiosSinGuardar()) {
    return confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir sin guardar?');
  }
  return true;
};

import { CanDeactivateFn } from '@angular/router';

export interface FormularioConCambios {
  tieneCambiosSinGuardar(): boolean;
}

export const cambiosSinGuardarGuard: CanDeactivateFn<FormularioConCambios> = (componente) =>
  componente.tieneCambiosSinGuardar()
    ? window.confirm('Tienes cambios sin guardar. ¿Quieres salir de todos modos?')
    : true;

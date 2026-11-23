import { HttpErrorResponse } from '@angular/common/http';

export function mensajeDeError(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) {
      return 'No se pudo conectar con la API. Verifica que el backend esté encendido.';
    }
    const cuerpo = err.error;
    if (cuerpo && typeof cuerpo === 'object' && 'message' in cuerpo) {
      const msg = (cuerpo as { message: string | string[] }).message;
      return Array.isArray(msg) ? msg.join('. ') : String(msg);
    }
    return `Error del servidor (${err.status})`;
  }
  return 'Ocurrió un error inesperado.';
}

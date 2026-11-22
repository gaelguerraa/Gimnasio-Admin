import { HttpErrorResponse } from '@angular/common/http';

/** Convierte errores del backend en mensajes útiles para la interfaz. */
export function mensajeHttp(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
  }
  const cuerpo = error.error as { message?: string | string[]; error?: string } | null;
  const mensaje = cuerpo?.message;
  if (Array.isArray(mensaje)) return mensaje.join('. ');
  if (mensaje) return mensaje;
  if (cuerpo?.error) return cuerpo.error;
  if (error.status === 0) return 'No se pudo conectar con el servidor.';
  return error.message || `La petición falló (${error.status}).`;
}

export const mensajeError = mensajeHttp;

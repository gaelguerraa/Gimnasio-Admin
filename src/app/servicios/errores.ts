/** Convierte los errores de la API en un mensaje legible para la interfaz. */
export function mensajeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'No se pudo conectar con el servidor.';
}

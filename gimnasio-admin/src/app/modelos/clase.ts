export type Categoria = 'fuerza' | 'cardio' | 'flexibilidad';

export const CATEGORIAS: Categoria[] = ['fuerza', 'cardio', 'flexibilidad'];

export interface Clase {
  id: number;
  nombre: string;
  categoria: Categoria;
  descripcion: string;
  duracionMin: number;
  imagen: string;
}

export interface Horario {
  id: number;
  dia: string;
  horaInicio: string;
  entrenador: string;
  cupoMaximo: number;
  disponibles: number;
}

export interface ClaseConHorarios extends Clase {
  horarios: Horario[];
}

export type ClaseNueva = Omit<Clase, 'id'>;

export interface Sobre<T> {
  data: T;
  meta: { ruta: string; duracionMs: number; timestamp: string };
}

export interface Usuario {
  correo: string;
  nombre: string;
  rol: 'miembro' | 'entrenador' | 'admin';
}

export interface RespuestaToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  usuario: Usuario;
}

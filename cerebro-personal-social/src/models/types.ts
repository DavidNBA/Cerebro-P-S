export interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  estado: 'no iniciado' | 'en progreso' | 'completado';
  fechaInicio?: string;
  fechaFin?: string;
}

export interface Task {
  id: string;
  nombre: string;
  completada: boolean;
  proyectoId: string;
}

export interface Contact {
  id: string;
  nombre: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
}

export interface Event {
  id: string;
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin?: string;
  ubicacion?: string;
}

export interface QuickNote {
  id: string;
  content: string;
  createdAt: string;
}

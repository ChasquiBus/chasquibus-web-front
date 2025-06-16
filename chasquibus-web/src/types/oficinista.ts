export interface Oficinista {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  email: string;
  activo: boolean;
  cooperativaTransporteId: number;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    email: string;
    activo: boolean;
    // Puedes agregar más campos si el backend los devuelve
  };
}

export interface CreateOficinistaDto {
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  email: string;
  password: string;
  cooperativaTransporteId: number;
}

export interface UpdateOficinistaDto {
  nombre?: string;
  apellido?: string;
  cedula?: string;
  telefono?: string;
  email?: string;
  password?: string;
  activo?: boolean;
} 
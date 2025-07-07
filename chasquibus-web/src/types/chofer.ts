

interface ChoferUsuario {
  id: number;
  email: string;
  nombre: string;
  apellido?: string;
  cedula?: string;
  telefono?: string;
  activo: boolean;
  rol: string; // O el tipo exacto de RolUsuario si se importa
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface ChoferCooperativa {
  id: number;
  nombre: string;
  colorPrimario?: string;
  colorSecundario?: string;
}

export interface Chofer {
  id: number;
  usuarioId: number;
  numeroLicencia: string;
  tipoLicencia: string;
  tipoSangre: string | null;
  fechaNacimiento: string | null;
  cooperativaTransporteId: number;
  usuario: ChoferUsuario;
  cooperativaTransporte: ChoferCooperativa | null;
}

export interface CreateChoferDto {
  email: string;
  password: string; 
  nombre: string;
  apellido: string;
  cedula: string;
  telefono?: string;
  activo?: boolean;
  numeroLicencia: string;
  tipoLicencia: string;
  tipoSangre?: string; 
  fechaNacimiento?: string; 
  cooperativaTransporteId: number;
}

export interface UpdateChoferDto {
  email?: string;
  password?: string;
  nombre?: string;
  apellido?: string;
  cedula?: string;
  telefono?: string;
  activo?: boolean;
  numeroLicencia?: string;
  tipoLicencia?: string;
  tipoSangre?: string;
  fechaNacimiento?: string;
  cooperativaTransporteId?: number;
} 
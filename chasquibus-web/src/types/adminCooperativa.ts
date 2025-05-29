export interface AdminCooperativa {
  id: number;
  cooperativaTransporteId: number;
  usuario: {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono?: string;
    activo: boolean;
    rol: number | string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
  };
}

export interface CreateAdminCooperativaDto {
  cooperativaTransporteId: number;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono?: string;
  activo?: boolean;
}

export interface UpdateAdminCooperativaDto {
  cooperativaTransporteId?: number;
  email?: string;
  password?: string;
  nombre?: string;
  apellido?: string;
  cedula?: string;
  telefono?: string;
  activo?: boolean;
} 
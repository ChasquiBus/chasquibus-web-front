export interface Cooperativa {
  id: number;
  nombre: string;
  ruc?: string;
  logo?: string;
  colorPrimario?: string;
  colorSecundario?: string;
  sitioWeb?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
}

export interface CreateCooperativaDto {
  nombre: string;
  ruc?: string;
  logo?: string;
  colorPrimario?: string;
  colorSecundario?: string;
  sitioWeb?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
}

export interface UpdateCooperativaDto extends CreateCooperativaDto {} 
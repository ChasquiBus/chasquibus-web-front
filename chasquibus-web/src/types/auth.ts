export type UserRole = 'user' | 'office' | 'client' | 'admin';

export interface User {
  id: number; // Cambiado a number para coincidir con el backend
  email: string;
  name: string; // Ajustado para mapear con nombre y apellido del backend
  role: UserRole; // Mapeado desde el backend
  createdAt: string; // Cambiado a string para coincidir con timestamp del backend
  updatedAt: string; // Cambiado a string para coincidir con timestamp del backend
  apellido?: string; // Opcional, para mapear con apellido del backend
  cedula?: string; // Opcional, para mapear con cedula del backend
  cooperativaTransporte?: {
    id: number;
    nombre: string;
    colorPrimario?: string;
    colorSecundario?: string;
    [key: string]: any;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: UserRole;
}
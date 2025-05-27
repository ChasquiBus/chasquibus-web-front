import { LoginCredentials, User } from '@/types/auth';

export async function login(credentials: LoginCredentials): Promise<User | null> {
  // Aquí iría la lógica real de autenticación
  return null;
}

export async function logout(): Promise<void> {
  // Lógica de logout
} 
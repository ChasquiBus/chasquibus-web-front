import { LoginCredentials, User, UserRole } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const login = async (credentials: LoginCredentials): Promise<{ access_token: string; user: User }> => {

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Credenciales inválidas');
    }
    throw new Error('Error en el servidor');
  }

  const data = await response.json();
  // Mapeo de roles del backend a frontend
  const mappedUser = {
    ...data.user,
    role: mapBackendRoleToFrontend(data.user.rol),
    name: `${data.user.nombre} ${data.user.apellido || ''}`, // Concatenar nombre y apellido
  };
  return { access_token: data.access_token, user: mappedUser };
};

const mapBackendRoleToFrontend = (backendRole: number): UserRole => {
  switch (backendRole) {
    case 1: return 'user';    // Admin → user
    case 2: return 'office';  // Oficinista → office
    case 4: return 'client';  // Cliente → client
    case 5: return 'admin';   // Superadmin → admin
    default: return 'client'; // Valor por defecto
  }
};

export const logout = async () => {
  // Lógica de logout (limpiar token, etc.)
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
};
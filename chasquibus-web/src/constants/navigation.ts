import { UserRole } from '../types/auth';

interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
}

interface RoleNavigation {
  [key: string]: NavigationItem[];
}

export const navigationByRole: RoleNavigation = {
  admin: [
    { label: 'Gestión de Usuarios', href: '/dashboard/admin/users' },
    { label: 'Gestión de Cooperativas', href: '/dashboard/admin/cooperatives' },
    { label: 'Configuración General', href: '/dashboard/admin/settings' },
    { label: 'Cerrar Sesión', href: '/auth/login' },
  ],
  user: [
    { label: 'Dashboard', href: '/user/dashboard' },
    { label: 'Mis Rutas', href: '/user/routes' },
    { label: 'Perfil', href: '/user/profile' },
  ],
  office: [
    { label: 'Dashboard', href: '/office/dashboard' },
    { label: 'Gestión de Rutas', href: '/office/routes' },
    { label: 'Clientes', href: '/office/clients' },
    { label: 'Reportes', href: '/office/reports' },
  ],
  client: [
    { label: 'Inicio', href: '/client/home' },
    { label: 'Buscar Rutas', href: '/client/search' },
    { label: 'Mis Viajes', href: '/client/trips' },
    { label: 'Perfil', href: '/client/profile' },
  ],
};

export const getNavigationForRole = (role: UserRole): NavigationItem[] => {
  return navigationByRole[role] || [];
}; 
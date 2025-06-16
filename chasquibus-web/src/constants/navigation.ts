import { UserRole } from '../types/auth';

export interface NavigationItem {
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
    { label: 'Gestión de Buses', href: '/dashboard/user/buses', icon: 'DirectionsBus' },
    { label: 'Gestión de Choferes', href: '/dashboard/user/choferes', icon: 'Group' },
    { label: 'Gestión de Frecuencias', href: '/dashboard/user/frequencies', icon: 'Schedule' },
    { label: 'Paradas y Rutas', href: '/dashboard/user/stops-routes', icon: 'Map' },
    { label: 'Hoja de Ruta', href: '/dashboard/user/route-sheet', icon: 'Assignment' },
    { label: 'Configuración Asientos', href: '/dashboard/user/configuracion-asientos', icon: 'Settings' },
    { label: 'Cerrar Sesión', href: '/auth/login', icon: 'Logout' },
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
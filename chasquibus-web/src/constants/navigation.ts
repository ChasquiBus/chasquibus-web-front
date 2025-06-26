import { UserRole } from '../types/auth';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import GroupIcon from '@mui/icons-material/Group';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import RoomIcon from '@mui/icons-material/Room';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import GavelIcon from '@mui/icons-material/Gavel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WorkIcon from '@mui/icons-material/Work';
import LogoutIcon from '@mui/icons-material/Logout';
import AirlineSeatLegroomNormalIcon from '@mui/icons-material/AirlineSeatLegroomNormal';
import SettingsIcon from '@mui/icons-material/Settings';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ScheduleIcon from '@mui/icons-material/Schedule';

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
    { label: 'Cerrar Sesión', href: '/auth/login' },
  ],
  user: [
    { label: 'Gestión de Buses', href: '/dashboard/user/buses', icon: 'DirectionsBus' },
    { label: 'Configuración Asientos', href: '/dashboard/user/configuracion-asientos', icon: 'AirlineSeatLegroomNormal' },
    { label: 'Gestión de Choferes', href: '/dashboard/user/choferes', icon: 'Group' },
    { label: 'Gestión de Paradas', href: '/dashboard/user/paradas', icon: 'Room' },
    { label: 'Gestión de Rutas', href: '/dashboard/user/rutas', icon: 'AltRoute' },
    { label: 'Gestión de Tarifas', href: '/dashboard/user/tarifas', icon: 'AttachMoney' },
    { label: 'Gestión de Frecuencias', href: '/dashboard/user/frequencies', icon: 'Schedule' },
    { label: 'Hojas de Trabajo', href: '/dashboard/user/route-sheet', icon: 'Assignment' },
    { label: 'Gestión Oficinistas', href: '/dashboard/user/oficinistas', icon: 'Work' },
    { label: 'Configuración', href: '/dashboard/user/configuracion', icon: 'Settings' },
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
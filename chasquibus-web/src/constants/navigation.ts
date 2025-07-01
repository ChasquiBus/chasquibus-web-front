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
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PercentIcon from '@mui/icons-material/Percent';

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
    { label: 'Dashboard', href: '/dashboard/admin', icon: 'Dashboard' },
    { label: 'Gestión de Usuarios', href: '/dashboard/admin/users' },
    { label: 'Gestión de Cooperativas', href: '/dashboard/admin/cooperatives' },
    { label: 'Cerrar Sesión', href: '/auth/login' },
  ],
  user: [
    { label: 'Dashboard', href: '/dashboard/user', icon: 'Dashboard' },
    { label: 'Gestión de Buses', href: '/dashboard/user/buses', icon: 'DirectionsBus' },
    { label: 'Configuración Asientos', href: '/dashboard/user/configuracion-asientos', icon: 'AirlineSeatLegroomNormal' },
    { label: 'Gestión de Choferes', href: '/dashboard/user/choferes', icon: 'Group' },
    { label: 'Gestión de Paradas', href: '/dashboard/user/paradas', icon: 'Room' },
    { label: 'Gestión de Rutas', href: '/dashboard/user/rutas', icon: 'AltRoute' },
    { label: 'Gestión de Tarifas', href: '/dashboard/user/tarifas', icon: 'AttachMoney' },
    { label: 'Gestión de Frecuencias', href: '/dashboard/user/frequencies', icon: 'Schedule' },
    { label: 'Hojas de Trabajo', href: '/dashboard/user/route-sheet', icon: 'Assignment' },
    { label: 'Gestión Oficinistas', href: '/dashboard/user/oficinistas', icon: 'Work' },
    { label: 'Boletos', href: '/dashboard/user/boletos', icon: 'ConfirmationNumber' },
    { label: 'Ventas', href: '/dashboard/user/ventas', icon: 'PointOfSale' },
    { label: 'Descuentos', href: '/dashboard/user/descuentos', icon: 'Percent' },
    { label: 'Configuración', href: '/dashboard/user/configuracion', icon: 'Settings' },
    { label: 'Cerrar Sesión', href: '/auth/login', icon: 'Logout' },
  ],
  office: [
    { label: 'Gestión de Buses', href: '/dashboard/office/buses', icon: 'DirectionsBus' },
    { label: 'Gestión de Choferes', href: '/dashboard/office/choferes', icon: 'Group' },
    { label: 'Gestión de Paradas', href: '/dashboard/office/paradas', icon: 'Room' },
    { label: 'Gestión de Rutas', href: '/dashboard/office/rutas', icon: 'AltRoute' },
    { label: 'Gestión de Tarifas', href: '/dashboard/office/tarifas', icon: 'AttachMoney' },
    { label: 'Gestión de Frecuencias', href: '/dashboard/office/frecuencias', icon: 'Schedule' },
    { label: 'Hojas de Trabajo', href: '/dashboard/office/hojas-trabajo', icon: 'Assignment' },
    { label: 'Boletos', href: '/dashboard/office/boletos', icon: 'ConfirmationNumber' },
    { label: 'Ventas', href: '/dashboard/office/ventas', icon: 'PointOfSale' },
    { label: 'Cerrar Sesión', href: '/auth/login', icon: 'Logout' },
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
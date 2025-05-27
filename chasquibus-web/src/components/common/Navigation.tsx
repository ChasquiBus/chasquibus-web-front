'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserRole } from '@/types/auth';
import { getNavigationForRole } from '@/constants/navigation';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const iconMap: Record<string, React.ReactNode> = {
  'Gestión de Usuarios': <PeopleIcon color="primary" />,
  'Gestión de Cooperativas': <BusinessIcon color="primary" />,
  'Configuración General': <SettingsIcon color="primary" />,
  'Cerrar Sesión': <LogoutIcon color="error" />,
};

interface NavigationProps {
  role: UserRole;
  menuOpen?: boolean;
  setMenuOpen?: (open: boolean) => void;
}

export default function Navigation({ role, menuOpen, setMenuOpen }: NavigationProps) {
  const pathname = usePathname();
  const navigationItems = getNavigationForRole(role);
  const [open, setOpen] = useState(menuOpen ?? true);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // Sincronizar estado local con el global si se pasa como prop
  useEffect(() => {
    if (typeof menuOpen === 'boolean') setOpen(menuOpen);
  }, [menuOpen]);

  const handleToggle = () => {
    if (setMenuOpen) setMenuOpen(!open);
    else setOpen((prev) => !prev);
  };

  // Botón flotante para abrir menú en mobile/tablet
  const floatingButton = !isDesktop && !open && (
    <IconButton
      onClick={handleToggle}
      size="large"
      color="primary"
      sx={{
        position: 'fixed',
        top: 16,
        left: 16,
        zIndex: 2000,
        background: '#f4f6fa',
        boxShadow: 1,
        '&:hover': { background: '#e3e6ed' }
      }}
    >
      <MenuIcon />
    </IconButton>
  );

  // Drawer permanente en desktop, Drawer desplegable en mobile
  return (
    <>
      {floatingButton}
      {/* Drawer permanente en desktop */}
      <Drawer
        variant={isDesktop ? 'permanent' : 'temporary'}
        open={open}
        onClose={handleToggle}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            position: isDesktop ? 'fixed' : 'absolute',
            top: 67, // altura del header
            bottom: 56, // altura del footer
            height: 'auto',
            width: open ? 260 : 64,
            transition: 'width 0.3s',
            overflowX: 'hidden',
            borderRadius: 3,
            boxShadow: 3,
            minHeight: 300,
          },
        }}
      >
        {/* Botón para cerrar menú en desktop */}
        {isDesktop && (
          <Box sx={{ display: 'flex', justifyContent: open ? 'flex-end' : 'center', alignItems: 'center', p: 1 }}>
            <IconButton onClick={handleToggle} size="large" color="primary">
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        )}
        <List>
          {navigationItems.map((item) => (
            <ListItem key={item.href} disablePadding sx={{ justifyContent: open ? 'flex-start' : 'center' }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={pathname === item.href}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  background: pathname === item.href ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  justifyContent: open ? 'flex-start' : 'center',
                  px: open ? 2 : 1,
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center' }}>
                  {iconMap[item.label] || null}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: pathname === item.href ? 700 : 500 }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      {/* Drawer temporal en mobile/tablet */}
      {!isDesktop && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleToggle}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, borderRadius: 3, mt: 8 },
          }}
        >
          <List>
            {navigationItems.map((item) => (
              <ListItem key={item.href} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={pathname === item.href}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    background: pathname === item.href ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  }}
                >
                  <ListItemIcon>
                    {iconMap[item.label] || null}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: pathname === item.href ? 700 : 500 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      )}
    </>
  );
} 
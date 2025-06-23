"use client";
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@mui/material/styles';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getInitials(name: string) {
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

export default function Header() {
  const { auth, logout } = useAuth();
  const user = auth.user;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    window.location.href = '/auth/login';
  };

  // Determinar logo cooperativa
  let logoUrl = '/images/logochaqui.jpg';
  if (user?.cooperativaTransporte?.logo) {
    logoUrl = `${BACKEND_URL}/upload/cooperativas/${user.cooperativaTransporte.logo}`;
  }

  return (
    <AppBar position="static" color="default" elevation={2} sx={{ background: theme.palette.primary.main, color: theme.palette.getContrastText(theme.palette.primary.main) }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo y nombre */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Image src={logoUrl} alt="Logo Cooperativa" width={60} height={50} style={{ borderRadius: 8, objectFit: 'contain', background: '#fff' }} />
          <Box>
            {user?.cooperativaTransporte?.nombre ? (
              <Typography variant="h6" color="inherit" fontWeight={700} sx={{ ml: 1, letterSpacing: 1 }}>
                {user.cooperativaTransporte.nombre}
              </Typography>
            ) : (
              <Typography variant="h6" color="inherit" fontWeight={700} sx={{ ml: 1, letterSpacing: 1 }}>
                Chasquibus
              </Typography>
            )}
          </Box>
        </Box>
        {/* Avatar, nombre y menú de usuario */}
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" color="text.primary" fontWeight={600} sx={{ mr: 1 }}>
              {user.name}
            </Typography>
            <Avatar
              sx={{ bgcolor: 'primary.main', cursor: 'pointer', width: 40, height: 40, fontWeight: 700, fontSize: 18 }}
              onClick={handleAvatarClick}
            >
              {getInitials(user.name)}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ textTransform: 'uppercase', fontSize: 13 }}>
                  {user.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 600 }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Typography variant="subtitle1" color="text.secondary">
            No autenticado
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}
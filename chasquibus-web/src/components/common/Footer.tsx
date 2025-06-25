"use client";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '@/hooks/useAuth';

export default function Footer() {
  const theme = useTheme();
  const { auth } = useAuth();
  const user = auth.user;
  return (
    <Box component="footer" sx={{
      width: '100%',
      py: 2,
      px: 2,
      textAlign: 'center',
      background: theme.palette.primary.main,
      borderTop: 'none',
      fontSize: '0.95rem',
      color: theme.palette.getContrastText(theme.palette.primary.main),
      letterSpacing: 1,
    }}>
      {user?.cooperativaTransporte?.nombre ? (
        <>
          <span style={{ fontWeight: 600 }}>{user.cooperativaTransporte.nombre}</span> &nbsp;|&nbsp;
          © 2025. Todos los derechos reservados.
        </>
      ) : (
        <>© 2025 Chasquibus. Todos los derechos reservados.</>
      )}
    </Box>
  );
}
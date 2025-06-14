"use client";
import Header from '@/components/common/Header';
import Navigation from '@/components/common/Navigation';
import Footer from '@/components/common/Footer';
import Box from '@mui/material/Box';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from '@/hooks/useAuth';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(true);
  const { auth } = useAuth();
  const user = auth.user;
  // Definir colores dinámicos
  const colorPrimario = user?.cooperativaTransporte?.colorPrimario || '#1976d2';
  const colorSecundario = user?.cooperativaTransporte?.colorSecundario || '#1565c0';
  const theme = createTheme({
    palette: {
      primary: { main: colorPrimario },
      secondary: { main: colorSecundario },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', background: '#f4f6fa', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', mx: 0, mt: 4, gap: 0, width: '100%', transition: 'all 0.3s' }}>
          {/* Botón para abrir el menú en mobile y desktop */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, position: 'absolute', top: 90, left: 20, zIndex: 1200 }}>
            <IconButton onClick={() => setMenuOpen(true)} color="primary" size="large">
              <MenuIcon fontSize="inherit" />
            </IconButton>
          </Box>
          {/* Menú lateral pegado al borde izquierdo */}
          <Box sx={{ minWidth: { xs: 0, md: menuOpen ? 260 : 64 }, maxWidth: { xs: 0, md: menuOpen ? 260 : 64 }, p: 0, borderRadius: 0, height: 'fit-content', display: { xs: 'none', md: 'block' }, transition: 'all 0.3s' }}>
            <Navigation role="user" menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          </Box>
          <Box sx={{ flex: 1, p: 3, background: 'white', borderRadius: 3, boxShadow: 2, ml: { xs: 0, md: 0 }, transition: 'all 0.3s' }}>
            {children}
          </Box>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
} 
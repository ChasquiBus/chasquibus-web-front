"use client";
import Header from '@/components/common/Header';
import Navigation from '@/components/common/Navigation';
import Footer from '@/components/common/Footer';
import Box from '@mui/material/Box';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <Box sx={{ minHeight: '100vh', background: '#f4f6fa', display: 'flex', flexDirection: 'column', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
      <Header />
      {/* Área central: Navigation + contenido, ocupa todo el espacio entre header y footer */}
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, height: '100%', background: 'white' }}>
        {/* Menú lateral estático, siempre debajo del header y sobre el footer */}
        <Box sx={{ minWidth: { xs: 0, md: menuOpen ? 260 : 64 }, maxWidth: { xs: 0, md: menuOpen ? 260 : 64 }, height: '100%', p: 0, borderRadius: 0, background: 'white', boxShadow: 2, transition: 'all 0.3s', display: { xs: 'none', md: 'block' } }}>
          <Navigation role="admin" menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </Box>
        {/* Contenido principal, ocupa el resto del espacio */}
        <Box sx={{ flex: 1, p: 3, background: 'white', borderRadius: 0, boxShadow: 0, minHeight: 0, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
} 
"use client";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box component="footer" sx={{
      width: '100%',
      py: 2,
      px: 2,
      mt: 6,
      textAlign: 'center',
      background: 'rgba(255,255,255,0.85)',
      borderTop: '1px solid #e0e0e0',
      fontSize: '0.95rem',
      color: '#888',
      letterSpacing: 1,
    }}>
      <Typography variant="body2" sx={{ fontWeight: 400 }}>
        © {new Date().getFullYear()} Chasquibus. Todos los derechos reservados.
      </Typography>
    </Box>
  );
}
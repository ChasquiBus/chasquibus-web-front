"use client";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '@/hooks/useAuth';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        {user?.cooperativaTransporte?.nombre ? (
          <>
            <span style={{ fontWeight: 600 }}>{user.cooperativaTransporte.nombre}</span> &nbsp;|&nbsp;
            © 2025. Todos los derechos reservados.
          </>
        ) : (
          <>© 2025 Chasquibus. Todos los derechos reservados.</>
        )}
      </Box>
      {/* Redes sociales */}
      {(user?.cooperativaTransporte?.facebook || user?.cooperativaTransporte?.instagram || user?.cooperativaTransporte?.twitter || user?.cooperativaTransporte?.tiktok) && (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)' }}>
          {user?.cooperativaTransporte?.facebook && (
            <a href={user.cooperativaTransporte.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
              <FacebookIcon sx={{ fontSize: 28, transition: 'color 0.2s', '&:hover': { color: 'white' } }} />
            </a>
          )}
          {user?.cooperativaTransporte?.instagram && (
            <a href={user.cooperativaTransporte.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
              <InstagramIcon sx={{ fontSize: 28, transition: 'color 0.2s', '&:hover': { color: 'white' } }} />
            </a>
          )}
          {user?.cooperativaTransporte?.twitter && (
            <a href={user.cooperativaTransporte.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
              <TwitterIcon sx={{ fontSize: 28, transition: 'color 0.2s', '&:hover': { color: 'white' } }} />
            </a>
          )}
          {user?.cooperativaTransporte?.tiktok && (
            <a href={user.cooperativaTransporte.tiktok} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
              <MusicNoteIcon sx={{ fontSize: 28, transition: 'color 0.2s', '&:hover': { color: 'white' } }} />
            </a>
          )}
        </Box>
      )}
    </Box>
  );
}
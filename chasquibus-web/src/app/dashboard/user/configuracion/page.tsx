"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Box, Typography, Button, TextField, Stack, CircularProgress, Snackbar, Alert, InputLabel, InputAdornment, IconButton } from "@mui/material";
import { cooperativesService } from '@/services/cooperatives';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

export default function ConfiguracionUsuario() {
  const { auth, setAuth } = useAuth();
  const user = auth.user;
  const cooperativaId = user?.cooperativaTransporte?.id;
  const [colorPrimario, setColorPrimario] = useState("#1976d2");
  const [colorSecundario, setColorSecundario] = useState("#1565c0");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [tiktok, setTiktok] = useState("");

  // Cargar datos actuales de la cooperativa
  useEffect(() => {
    const fetchCoop = async () => {
      if (!cooperativaId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/cooperativas/${cooperativaId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('No se pudo cargar la cooperativa');
        const data = await res.json();
        setColorPrimario(data.colorPrimario || "#1976d2");
        setColorSecundario(data.colorSecundario || "#1565c0");
        if (data.logo) setLogoPreview(data.logo);
        setFacebook(data.facebook || "");
        setInstagram(data.instagram || "");
        setTwitter(data.twitter || "");
        setTiktok(data.tiktok || "");
      } catch (err: any) {
        setError(err.message || 'Error al cargar la cooperativa');
      } finally {
        setLoading(false);
      }
    };
    fetchCoop();
  }, [cooperativaId]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !file.type.startsWith('image/')) {
      setError('El logo debe ser una imagen válida');
      setLogoFile(null);
      setLogoPreview(null);
      return;
    }
    setLogoFile(file || null);
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('access_token');
      let body: any;
      let isFormData = false;
      if (logoFile) {
        body = new FormData();
        body.append('colorPrimario', colorPrimario);
        body.append('colorSecundario', colorSecundario);
        body.append('logo', logoFile);
        body.append('facebook', facebook);
        body.append('instagram', instagram);
        body.append('twitter', twitter);
        body.append('tiktok', tiktok);
        isFormData = true;
      } else {
        body = JSON.stringify({ colorPrimario, colorSecundario, facebook, instagram, twitter, tiktok });
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/cooperativas/${cooperativaId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(isFormData ? {} : { 'Content-Type': 'application/json' })
        },
        body
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al actualizar la cooperativa');
      }
      // Refrescar cooperativa y actualizar el contexto global del usuario
      const coopRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/cooperativas/${cooperativaId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (coopRes.ok) {
        const coopActualizada = await coopRes.json();
        setAuth((prev: any) => ({
          ...prev,
          user: {
            ...prev.user,
            cooperativaTransporte: coopActualizada
          }
        }));
        // Actualizar también en localStorage si es necesario
        if (typeof window !== 'undefined') {
          const userLocal = JSON.parse(localStorage.getItem('user') || '{}');
          userLocal.cooperativaTransporte = coopActualizada;
          localStorage.setItem('user', JSON.stringify(userLocal));
        }
      }
      setSuccess('¡Configuración actualizada correctamente!');
      setTimeout(() => {
        window.location.reload();
      }, 600); // Espera 1.2 segundos para mostrar el mensaje antes de recargar
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la cooperativa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="calc(100vh - 120px)" display="flex" alignItems="center" justifyContent="center">
      <Box maxWidth={800} width="100%" mx="auto" my={4}>
        <Typography variant="h5" color="black" fontWeight={700} mb={3} align="center">Configuración de Cooperativa</Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start', justifyContent: 'center' }}>
            {/* Columna 1: Colores y Logo */}
            <Box sx={{ flex: { xs: '1', md: '0 0 50%' } }}>
              <Stack spacing={3}>
                <Box>
                  <InputLabel sx={{ mb: 1, color: 'black' }}>Color Primario</InputLabel>
                  <TextField
                    type="color"
                    value={colorPrimario}
                    onChange={e => setColorPrimario(e.target.value)}
                    sx={{ width: 60, height: 60, p: 0, minWidth: 0 }}
                    inputProps={{ style: { padding: 0, width: 60, height: 60, cursor: 'pointer' }, maxLength: 20 }}
                  />
                </Box>
                <Box>
                  <InputLabel sx={{ mb: 1, color: 'black' }}>Color Secundario</InputLabel>
                  <TextField
                    type="color"
                    value={colorSecundario}
                    onChange={e => setColorSecundario(e.target.value)}
                    sx={{ width: 60, height: 60, p: 0, minWidth: 0 }}
                    inputProps={{ style: { padding: 0, width: 60, height: 60, cursor: 'pointer' }, maxLength: 20 }}
                  />
                </Box>
                <Box>
                  <InputLabel sx={{ mb: 1 , color: 'black'}}>Logo de la Cooperativa</InputLabel>
                  <Button variant="outlined" component="label" sx={{ width: '100%', py: 1.5, borderStyle: 'dashed', borderWidth: 2, borderRadius: 2 }}>
                    Seleccionar Logo
                    <input type="file" accept="image/*" hidden onChange={handleLogoChange} />
                  </Button>
                  {logoPreview && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <img src={logoPreview} alt="Logo preview" style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 8, border: '2px solid #e0e0e0', backgroundColor: '#fafafa' }} />
                    </Box>
                  )}
                </Box>
              </Stack>
            </Box>
            {/* Columna 2: Redes Sociales y Guardar */}
            <Box sx={{ flex: { xs: '1', md: '0 0 50%' } }}>
              <Stack spacing={3}>
                <Box>
                  <InputLabel sx={{ mb: 1, color: 'black' }}>Redes Sociales</InputLabel>
                  <Stack spacing={2}>
                    <TextField
                      label="Facebook"
                      placeholder="https://facebook.com/mi-cooperativa"
                      value={facebook}
                      onChange={e => setFacebook(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FacebookIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                    />
                    <TextField
                      label="Instagram"
                      placeholder="https://instagram.com/mi-cooperativa"
                      value={instagram}
                      onChange={e => setInstagram(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <InstagramIcon sx={{ color: '#E1306C' }} />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                    />
                    <TextField
                      label="Twitter"
                      placeholder="https://twitter.com/mi-cooperativa"
                      value={twitter}
                      onChange={e => setTwitter(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TwitterIcon sx={{ color: '#1DA1F2' }} />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                    />
                    <TextField
                      label="TikTok"
                      placeholder="https://tiktok.com/@mi-cooperativa"
                      value={tiktok}
                      onChange={e => setTiktok(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MusicNoteIcon sx={{ color: '#000' }} />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                    />
                  </Stack>
                </Box>
                <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ fontWeight: 600, py: 1.2 }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar Cambios'}
                </Button>
              </Stack>
            </Box>
          </Box>
        </form>
        <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess(null)}>
          <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>{success}</Alert>
        </Snackbar>
        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>{error}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
} 
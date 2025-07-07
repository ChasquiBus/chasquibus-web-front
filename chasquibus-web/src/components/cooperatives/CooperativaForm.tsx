import React, { useMemo, useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  InputAdornment,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CreateCooperativaDto } from '@/types/cooperatives';
import { validarRucEcuador, validarEmail, validarCelularEcuador, validarSitioWeb } from '@/lib/utils/validations';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import Grid from '@mui/material/Grid';

interface CooperativaFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateCooperativaDto & { logo?: File }) => Promise<void>;
  initialValues?: CreateCooperativaDto;
  title: string;
}

const validationSchema = Yup.object({
  nombre: Yup.string()
    .max(100, 'Máximo 100 caracteres')
    .required('El nombre es obligatorio'),
  ruc: Yup.string()
    .max(20, 'Máximo 20 caracteres')
    .required('El RUC es obligatorio')
    .matches(/^[0-9]{13}$/, 'El RUC debe tener exactamente 13 dígitos numéricos')
    .test('ruc-ec-format', 'El RUC no tiene un formato válido para Ecuador', (value) => {
      if (!value) return false;
      return validarRucEcuador(value);
    }),
  email: Yup.string()
    .max(100, 'Máximo 100 caracteres')
    .email('El correo electrónico no tiene un formato válido')
    .nullable()
    .test('is-valid-or-empty', 'El correo electrónico no tiene un formato válido', (value) => {
      if (!value) return true; // Permitir vacío
      return validarEmail(value);
    }),
  telefono: Yup.string()
    .max(20, 'Máximo 20 caracteres')
    .nullable()
    .test('is-valid-or-empty', 'El número debe tener 10 dígitos y empezar con 09', (value) => {
      if (!value || value.length === 0) return true; // Permitir vacío
      return validarCelularEcuador(value);
    }),
  direccion: Yup.string()
    .max(255, 'Máximo 255 caracteres')
    .optional(),
  sitioWeb: Yup.string()
    .max(255, 'Máximo 255 caracteres')
    .nullable()
    .test('is-valid-or-empty', 'El sitio web debe tener el formato https://www.ejemplo.com', (value) => {
      if (!value || value.length === 0) return true;
      return validarSitioWeb(value);
    }),
  colorPrimario: Yup.string()
    .max(20, 'Máximo 20 caracteres')
    .optional(),
  colorSecundario: Yup.string()
    .max(20, 'Máximo 20 caracteres')
    .optional(),
  tiktok: Yup.string()
    .max(255, 'Máximo 255 caracteres')
    .nullable(),
  facebook: Yup.string()
    .max(255, 'Máximo 255 caracteres')
    .nullable(),
  instagram: Yup.string()
    .max(255, 'Máximo 255 caracteres')
    .nullable(),
  twitter: Yup.string()
    .max(255, 'Máximo 255 caracteres')
    .nullable(),
});

export default function CooperativaForm({
  open,
  onClose,
  onSubmit,
  initialValues,
  title,
}: CooperativaFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [facebook, setFacebook] = useState(initialValues?.facebook || '');
  const [instagram, setInstagram] = useState(initialValues?.instagram || '');
  const [twitter, setTwitter] = useState(initialValues?.twitter || '');
  const [tiktok, setTiktok] = useState(initialValues?.tiktok || '');

  const stableInitialValues = useMemo(() => ({
    nombre: initialValues?.nombre || '',
    ruc: initialValues?.ruc || '',
    email: initialValues?.email || '',
    telefono: initialValues?.telefono || '',
    direccion: initialValues?.direccion || '',
    sitioWeb: initialValues?.sitioWeb || '',
    colorPrimario: /^#[0-9A-Fa-f]{6}$/.test(initialValues?.colorPrimario || '') ? initialValues?.colorPrimario : '#000000',
    colorSecundario: /^#[0-9A-Fa-f]{6}$/.test(initialValues?.colorSecundario || '') ? initialValues?.colorSecundario : '#000000',
    facebook: initialValues?.facebook || '',
    instagram: initialValues?.instagram || '',
    twitter: initialValues?.twitter || '',
    tiktok: initialValues?.tiktok || '',
  }), [initialValues]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !file.type.startsWith('image/')) {
      alert('El logo debe ser una imagen válida (PNG, JPG, JPEG, etc.)');
      setLogoFile(null);
      setLogoPreview(null);
      return;
    }
    setLogoFile(file || null);
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  };

  const formik = useFormik({
    initialValues: stableInitialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const data: any = { ...values };
      if (logoFile) data.logo = logoFile;
      Object.keys(data).forEach((key) => {
        if (data[key] === '' || data[key] === undefined) delete data[key];
      });
      await onSubmit(data);
      onClose();
    },
  });

  // Handler para solo permitir números y máximo 13 dígitos en RUC
  const handleRucChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Solo números
    if (value.length > 13) value = value.slice(0, 13);
    formik.setFieldValue('ruc', value);
  };

  // Handler para solo permitir números y máximo 10 dígitos en teléfono
  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Solo números
    if (value.length > 10) value = value.slice(0, 10);
    formik.setFieldValue('telefono', value);
  };

  // Efecto para ocultar scroll global cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    };
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{
      sx: {
        borderRadius: 4,
        background: '#f9fafb',
        minWidth: { lg: 1100 },
      }
    }}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 26, pb: 0 }}>
        {title}
      </DialogTitle>
      <Typography sx={{ px: 4, pt: 1, pb: 2, color: 'text.secondary', fontSize: 16 }}>
        Ingresa los datos de la cooperativa. Los campos marcados con * son obligatorios.
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{
          pt: 0,
          pb: 0,
          overflowY: 'auto',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE y Edge
          '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari, Opera
        }}>
          <Box sx={{
            background: '#fff',
            borderRadius: 3,
            p: { xs: 2, md: 4 },
            mt: 1,
            mb: 2
          }}>
            <Grid container spacing={3} alignItems="flex-start">
              {/* Columna 1: Datos básicos */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 0 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>Datos Básicos</Typography>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      id="nombre"
                      name="nombre"
                      label="Nombre de la Cooperativa"
                      placeholder="Ej: Cooperativa de Transportes Unidos"
                      value={formik.values.nombre}
                      onChange={formik.handleChange}
                      error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                      helperText={formik.touched.nombre && formik.errors.nombre}
                      size="medium"
                    />
                    <TextField
                      fullWidth
                      id="ruc"
                      name="ruc"
                      label="RUC"
                      placeholder="Ej: 1724727225001"
                      value={formik.values.ruc}
                      onChange={handleRucChange}
                      inputProps={{ maxLength: 13, inputMode: 'numeric', pattern: '[0-9]*' }}
                      error={formik.touched.ruc && Boolean(formik.errors.ruc)}
                      helperText={formik.touched.ruc && formik.errors.ruc}
                      size="medium"
                    />
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Correo Electrónico"
                      placeholder="Ej: contacto@cooperativa.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                      size="medium"
                    />
                    <TextField
                      fullWidth
                      id="telefono"
                      name="telefono"
                      label="Teléfono"
                      placeholder="Ej: 0998765432"
                      value={formik.values.telefono}
                      onChange={handleTelefonoChange}
                      inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
                      error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                      helperText={formik.touched.telefono && formik.errors.telefono}
                      size="medium"
                    />
                  </Stack>
                </Box>
              </Grid>

              {/* Columna 2: Sitio web, dirección, redes sociales */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 0 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>Contacto y Redes Sociales</Typography>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      id="sitioWeb"
                      name="sitioWeb"
                      label="Sitio Web"
                      placeholder="Ej: https://www.cooperativa.com"
                      value={formik.values.sitioWeb}
                      onChange={formik.handleChange}
                      error={formik.touched.sitioWeb && Boolean(formik.errors.sitioWeb)}
                      helperText={formik.touched.sitioWeb && formik.errors.sitioWeb}
                      size="medium"
                    />
                    <TextField
                      fullWidth
                      id="direccion"
                      name="direccion"
                      label="Dirección"
                      placeholder="Ej: Av. Principal 123, Lima"
                      value={formik.values.direccion}
                      onChange={formik.handleChange}
                      error={formik.touched.direccion && Boolean(formik.errors.direccion)}
                      helperText={formik.touched.direccion && formik.errors.direccion}
                      size="medium"
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
                        Redes Sociales
                      </Typography>
                      <Stack spacing={1.5}>
                        <TextField
                          label="Facebook"
                          placeholder="https://facebook.com/mi-cooperativa"
                          id="facebook"
                          name="facebook"
                          value={formik.values.facebook}
                          onChange={formik.handleChange}
                          error={Boolean(formik.touched.facebook && formik.errors.facebook)}
                          helperText={formik.touched.facebook && formik.errors.facebook}
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
                          id="instagram"
                          name="instagram"
                          value={formik.values.instagram}
                          onChange={formik.handleChange}
                          error={Boolean(formik.touched.instagram && formik.errors.instagram)}
                          helperText={formik.touched.instagram && formik.errors.instagram}
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
                          id="twitter"
                          name="twitter"
                          value={formik.values.twitter}
                          onChange={formik.handleChange}
                          error={Boolean(formik.touched.twitter && formik.errors.twitter)}
                          helperText={formik.touched.twitter && formik.errors.twitter}
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
                          id="tiktok"
                          name="tiktok"
                          value={formik.values.tiktok}
                          onChange={formik.handleChange}
                          error={Boolean(formik.touched.tiktok && formik.errors.tiktok)}
                          helperText={formik.touched.tiktok && formik.errors.tiktok}
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
                  </Stack>
                </Box>
              </Grid>

              {/* Columna 3: Colores y Logo */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 0 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>Colores y Logo</Typography>
                  <Stack spacing={2}>
                    <Box sx={{ width: '100%', mt: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
                        Colores de la Cooperativa
                      </Typography>
                      <Grid container spacing={2} alignItems="center">
                        <Grid size={6}>
                          <Box display="flex" flexDirection="column" alignItems="flex-start">
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                              Color Principal
                            </Typography>
                            <TextField
                              id="colorPrimario"
                              name="colorPrimario"
                              type="color"
                              value={formik.values.colorPrimario || '#000000'}
                              onChange={formik.handleChange}
                              sx={{
                                width: 48,
                                height: 48,
                                p: 0,
                                minWidth: 0,
                                borderRadius: 2,
                                boxShadow: 1,
                                background: '#f3f4f6',
                                '& .MuiInputBase-root': {
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                  background: '#fff',
                                }
                              }}
                              inputProps={{
                                style: {
                                  padding: 0,
                                  width: 48,
                                  height: 48,
                                  cursor: 'pointer',
                                  border: 'none',
                                  background: 'none',
                                }
                              }}
                            />
                          </Box>
                        </Grid>
                        <Grid size={6}>
                          <Box display="flex" flexDirection="column" alignItems="flex-start">
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                              Color Secundario
                            </Typography>
                            <TextField
                              id="colorSecundario"
                              name="colorSecundario"
                              type="color"
                              value={formik.values.colorSecundario || '#000000'}
                              onChange={formik.handleChange}
                              sx={{
                                width: 48,
                                height: 48,
                                p: 0,
                                minWidth: 0,
                                borderRadius: 2,
                                boxShadow: 1,
                                background: '#f3f4f6',
                                '& .MuiInputBase-root': {
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                  background: '#fff',
                                }
                              }}
                              inputProps={{
                                style: {
                                  padding: 0,
                                  width: 48,
                                  height: 48,
                                  cursor: 'pointer',
                                  border: 'none',
                                  background: 'none',
                                }
                              }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    {/* Logo */}
                    <Box sx={{ width: '100%', mt: 1 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
                        Logo de la Cooperativa
                      </Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          width: '100%',
                          py: 1.5,
                          borderStyle: 'dashed',
                          borderWidth: 2,
                          borderRadius: 2,
                          color: '#1976d2',
                          background: '#f3f4f6',
                          fontWeight: 500,
                          letterSpacing: 1,
                          '&:hover': {
                            background: '#e3e6ea',
                            borderColor: '#1976d2',
                          }
                        }}
                      >
                        {logoFile ? 'Cambiar Logo' : 'Seleccionar Logo (Opcional)'}
                        <input type="file" accept="image/*" hidden onChange={handleLogoChange} />
                      </Button>
                      {logoPreview && (
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                          <img
                            src={logoPreview}
                            alt="Vista previa del logo"
                            style={{
                              width: 90,
                              height: 90,
                              objectFit: 'contain',
                              borderRadius: 8,
                              border: '2px solid #e0e0e0',
                              backgroundColor: '#fafafa',
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} variant="outlined" sx={{ minWidth: 140, fontWeight: 500 }}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{ minWidth: 180, fontWeight: 600 }}>
            Guardar Cooperativa
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 
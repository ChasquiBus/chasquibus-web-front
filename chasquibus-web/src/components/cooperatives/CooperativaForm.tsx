import React, { useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Stack,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CreateCooperativaDto } from '@/types/cooperatives';

interface CooperativaFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateCooperativaDto) => Promise<void>;
  initialValues?: CreateCooperativaDto;
  title: string;
}

const validationSchema = Yup.object({
  nombre: Yup.string().required('El nombre es obligatorio'),
  ruc: Yup.string()
    .matches(/^[0-9]{10,13}$/, 'El RUC debe tener entre 10 y 13 dígitos')
    .optional(),
  email: Yup.string().email('Email inválido').optional(),
  telefono: Yup.string().optional(),
  direccion: Yup.string().optional(),
  sitioWeb: Yup.string().url('URL inválida').optional(),
  colorPrimario: Yup.string().optional(),
  colorSecundario: Yup.string().optional(),
});

export default function CooperativaForm({
  open,
  onClose,
  onSubmit,
  initialValues,
  title,
}: CooperativaFormProps) {
  const stableInitialValues = useMemo(() => ({
    nombre: initialValues?.nombre || '',
    ruc: initialValues?.ruc || '',
    email: initialValues?.email || '',
    telefono: initialValues?.telefono || '',
    direccion: initialValues?.direccion || '',
    sitioWeb: initialValues?.sitioWeb || '',
    colorPrimario: /^#[0-9A-Fa-f]{6}$/.test(initialValues?.colorPrimario || '') ? initialValues?.colorPrimario : '#000000',
    colorSecundario: /^#[0-9A-Fa-f]{6}$/.test(initialValues?.colorSecundario || '') ? initialValues?.colorSecundario : '#000000',
  }), [initialValues]);

  const formik = useFormik({
    initialValues: stableInitialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              id="nombre"
              name="nombre"
              label="Nombre"
              value={formik.values.nombre}
              onChange={formik.handleChange}
              error={formik.touched.nombre && Boolean(formik.errors.nombre)}
              helperText={formik.touched.nombre && formik.errors.nombre}
            />
            <TextField
              fullWidth
              id="ruc"
              name="ruc"
              label="RUC"
              value={formik.values.ruc}
              onChange={formik.handleChange}
              error={formik.touched.ruc && Boolean(formik.errors.ruc)}
              helperText={formik.touched.ruc && formik.errors.ruc}
            />
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              id="telefono"
              name="telefono"
              label="Teléfono"
              value={formik.values.telefono}
              onChange={formik.handleChange}
              error={formik.touched.telefono && Boolean(formik.errors.telefono)}
              helperText={formik.touched.telefono && formik.errors.telefono}
            />
            <TextField
              fullWidth
              id="sitioWeb"
              name="sitioWeb"
              label="Sitio Web"
              value={formik.values.sitioWeb}
              onChange={formik.handleChange}
              error={formik.touched.sitioWeb && Boolean(formik.errors.sitioWeb)}
              helperText={formik.touched.sitioWeb && formik.errors.sitioWeb}
            />
            <TextField
              fullWidth
              id="direccion"
              name="direccion"
              label="Dirección"
              value={formik.values.direccion}
              onChange={formik.handleChange}
              error={formik.touched.direccion && Boolean(formik.errors.direccion)}
              helperText={formik.touched.direccion && formik.errors.direccion}
            />
            <Box display="flex" gap={4} alignItems="center" mt={1}>
              <Box display="flex" flexDirection="column" alignItems="flex-start">
                <Typography variant="body2" sx={{ mb: 0.5 }}>Color primario</Typography>
                <TextField
                  id="colorPrimario"
                  name="colorPrimario"
                  type="color"
                  value={formik.values.colorPrimario || '#000000'}
                  onChange={formik.handleChange}
                  sx={{ width: 56, height: 56, p: 0, minWidth: 0 }}
                  inputProps={{ style: { padding: 0, width: 40, height: 40 } }}
                />
              </Box>
              <Box display="flex" flexDirection="column" alignItems="flex-start">
                <Typography variant="body2" sx={{ mb: 0.5 }}>Color secundario</Typography>
                <TextField
                  id="colorSecundario"
                  name="colorSecundario"
                  type="color"
                  value={formik.values.colorSecundario || '#000000'}
                  onChange={formik.handleChange}
                  sx={{ width: 56, height: 56, p: 0, minWidth: 0 }}
                  inputProps={{ style: { padding: 0, width: 40, height: 40 } }}
                />
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 
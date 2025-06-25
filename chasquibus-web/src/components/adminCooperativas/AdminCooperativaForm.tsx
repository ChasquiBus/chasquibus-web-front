import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Stack, Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CreateAdminCooperativaDto } from '@/types/adminCooperativa';
import { Cooperativa } from '@/types/cooperatives';
import { validarEmail, validarCelularEcuador, validarCedulaEcuador } from '@/lib/utils/validations';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateAdminCooperativaDto | Partial<CreateAdminCooperativaDto>) => Promise<void>;
  initialValues?: Partial<CreateAdminCooperativaDto>;
  title: string;
  cooperativas: Cooperativa[];
  isEdit?: boolean;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .max(100, 'Máximo 100 caracteres')
    .required('El email es obligatorio')
    .test('is-valid-email', 'El email no es válido', (value) => {
      if (!value) return false;
      return validarEmail(value);
    }),
  password: Yup.string()
    .when('isEdit', {
    is: false,
    then: schema => schema.required('La contraseña es obligatoria').min(8, 'Mínimo 8 caracteres'),
    otherwise: schema => schema,
  }),
  nombre: Yup.string()
    .max(100, 'Máximo 100 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, 'El nombre solo debe contener letras')
    .required('El nombre es obligatorio'),
  apellido: Yup.string()
    .max(100, 'Máximo 100 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, 'El apellido solo debe contener letras')
    .required('El apellido es obligatorio'),
  cedula: Yup.string()
    .required('La cédula es obligatoria')
    .test('is-valid-cedula', 'La cédula ecuatoriana no es válida', (value) => {
      if (!value) return false;
      return validarCedulaEcuador(value);
    }),
  telefono: Yup.string()
    .max(20, 'Máximo 20 caracteres')
    .required('El teléfono es obligatorio')
    .test('is-valid-phone', 'El teléfono debe tener el formato correcto', (value) => {
      if (!value) return false;
      return validarCelularEcuador(value);
    }),
  cooperativaTransporteId: Yup.number().required('La cooperativa es obligatoria'),
  activo: Yup.boolean().optional(),
});

export default function AdminCooperativaForm({
  open, onClose, onSubmit, initialValues, title, cooperativas, isEdit
}: Props) {
  const formik = useFormik({
    initialValues: {
      email: initialValues?.email || '',
      password: '',
      nombre: initialValues?.nombre || '',
      apellido: initialValues?.apellido || '',
      cedula: initialValues?.cedula || '',
      telefono: initialValues?.telefono || '',
      activo: initialValues?.activo ?? true,
      cooperativaTransporteId: initialValues?.cooperativaTransporteId || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      let data = { ...values };
      if (typeof data.cooperativaTransporteId === 'string') {
        data.cooperativaTransporteId = parseInt(data.cooperativaTransporteId, 10);
      }
      if (isEdit && !values.password) {
        const { password, ...rest } = data;
        await onSubmit(rest);
      } else {
        await onSubmit(data);
      }
      onClose();
    },
  });

  // Handlers para restringir la entrada en los campos
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, '');
    formik.setFieldValue('nombre', value);
  };
  const handleApellidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, '');
    formik.setFieldValue('apellido', value);
  };
  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    formik.setFieldValue('cedula', value);
  };
  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    formik.setFieldValue('telefono', value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  placeholder="Ej: juan.perez@cooperativa.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Contraseña"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={isEdit ? 'Dejar vacío para no cambiar' : (formik.touched.password && formik.errors.password)}
                />
                <TextField
                  fullWidth
                  id="nombre"
                  name="nombre"
                  label="Nombre"
                  placeholder="Ej: Juan Carlos"
                  value={formik.values.nombre}
                  onChange={handleNombreChange}
                  error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                  helperText={formik.touched.nombre && formik.errors.nombre}
                />
                <TextField
                  fullWidth
                  id="apellido"
                  name="apellido"
                  label="Apellido"
                  placeholder="Ej: Pérez González"
                  value={formik.values.apellido}
                  onChange={handleApellidoChange}
                  error={formik.touched.apellido && Boolean(formik.errors.apellido)}
                  helperText={formik.touched.apellido && formik.errors.apellido}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  id="cedula"
                  name="cedula"
                  label="Cédula"
                  placeholder="Ej: 1710034065"
                  value={formik.values.cedula}
                  onChange={handleCedulaChange}
                  inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
                  error={formik.touched.cedula && Boolean(formik.errors.cedula)}
                  helperText={formik.touched.cedula && formik.errors.cedula}
                />
                <TextField
                  fullWidth
                  id="telefono"
                  name="telefono"
                  label="Teléfono"
                  placeholder="Ej: +593987654321"
                  value={formik.values.telefono}
                  onChange={handleTelefonoChange}
                  inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
                  error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                  helperText={formik.touched.telefono && formik.errors.telefono}
                />
                <TextField
                  select
                  fullWidth
                  id="cooperativaTransporteId"
                  name="cooperativaTransporteId"
                  label="Cooperativa"
                  placeholder="Selecciona una cooperativa"
                  value={formik.values.cooperativaTransporteId || ''}
                  onChange={formik.handleChange}
                  error={formik.touched.cooperativaTransporteId && Boolean(formik.errors.cooperativaTransporteId)}
                  helperText={formik.touched.cooperativaTransporteId && formik.errors.cooperativaTransporteId}
                  required
                >
                  {cooperativas.filter((coop) => coop.activo).map((coop) => (
                    <MenuItem key={coop.id} value={coop.id}>{coop.nombre}</MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Grid>
          </Grid>
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
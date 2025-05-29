import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Stack
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CreateAdminCooperativaDto } from '@/types/adminCooperativa';
import { Cooperativa } from '@/types/cooperatives';

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
  cooperativaTransporteId: Yup.number().required('Seleccione una cooperativa'),
  email: Yup.string().email('Email inválido').required('El email es obligatorio'),
  password: Yup.string().when('isEdit', {
    is: false,
    then: schema => schema.required('La contraseña es obligatoria').min(8, 'Mínimo 8 caracteres'),
    otherwise: schema => schema,
  }),
  nombre: Yup.string().required('El nombre es obligatorio'),
  apellido: Yup.string().required('El apellido es obligatorio'),
  cedula: Yup.string().matches(/^\d{10}$/, 'La cédula debe tener 10 dígitos').required('La cédula es obligatoria'),
  telefono: Yup.string().optional(),
  activo: Yup.boolean().optional(),
});

export default function AdminCooperativaForm({
  open, onClose, onSubmit, initialValues, title, cooperativas, isEdit
}: Props) {
  const formik = useFormik({
    initialValues: {
      cooperativaTransporteId: initialValues?.cooperativaTransporteId || '',
      email: initialValues?.email || '',
      password: '',
      nombre: initialValues?.nombre || '',
      apellido: initialValues?.apellido || '',
      cedula: initialValues?.cedula || '',
      telefono: initialValues?.telefono || '',
      activo: initialValues?.activo ?? true,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      if (isEdit && !values.password) {
        const { password, ...rest } = values;
        await onSubmit(rest);
      } else {
        await onSubmit(values);
      }
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
              select
              fullWidth
              id="cooperativaTransporteId"
              name="cooperativaTransporteId"
              label="Cooperativa"
              value={formik.values.cooperativaTransporteId}
              onChange={formik.handleChange}
              error={formik.touched.cooperativaTransporteId && Boolean(formik.errors.cooperativaTransporteId)}
              helperText={formik.touched.cooperativaTransporteId && formik.errors.cooperativaTransporteId}
            >
              {cooperativas.map((coop) => (
                <MenuItem key={coop.id} value={coop.id}>
                  {coop.nombre}
                </MenuItem>
              ))}
            </TextField>
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
              id="password"
              name="password"
              label="Contraseña"
              type="password"
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
              value={formik.values.nombre}
              onChange={formik.handleChange}
              error={formik.touched.nombre && Boolean(formik.errors.nombre)}
              helperText={formik.touched.nombre && formik.errors.nombre}
            />
            <TextField
              fullWidth
              id="apellido"
              name="apellido"
              label="Apellido"
              value={formik.values.apellido}
              onChange={formik.handleChange}
              error={formik.touched.apellido && Boolean(formik.errors.apellido)}
              helperText={formik.touched.apellido && formik.errors.apellido}
            />
            <TextField
              fullWidth
              id="cedula"
              name="cedula"
              label="Cédula"
              value={formik.values.cedula}
              onChange={formik.handleChange}
              error={formik.touched.cedula && Boolean(formik.errors.cedula)}
              helperText={formik.touched.cedula && formik.errors.cedula}
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
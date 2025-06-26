import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { CreateOficinistaDto, UpdateOficinistaDto, Oficinista } from '@/types/oficinista';
import { TextField, Button, Box, Typography, Switch, FormControlLabel } from '@mui/material';

interface OficinistaFormProps {
  initialData?: Oficinista | null;
  onSubmit: (values: CreateOficinistaDto | UpdateOficinistaDto) => void;
  onCancel: () => void;
  cooperativaId: number;
  isEdit?: boolean;
}

const OficinistaForm: React.FC<OficinistaFormProps> = ({ initialData, onSubmit, onCancel, cooperativaId, isEdit }) => {
  const validationSchema = yup.object({
    nombre: yup.string().required('El nombre es obligatorio'),
    apellido: yup.string().required('El apellido es obligatorio'),
    cedula: yup.string().required('La cédula es obligatoria').matches(/^[0-9]{10}$/, 'La cédula debe tener 10 dígitos'),
    telefono: yup.string().required('El teléfono es obligatorio'),
    email: yup.string().email('Introduce un email válido').required('El email es obligatorio'),
    password: isEdit
      ? yup.string()
      : yup.string().required('La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
  });

  const formik = useFormik<CreateOficinistaDto | UpdateOficinistaDto>({
    initialValues: {
      nombre: initialData?.usuario?.nombre || '',
      apellido: initialData?.usuario?.apellido || '',
      cedula: initialData?.usuario?.cedula || '',
      telefono: initialData?.usuario?.telefono || '',
      email: initialData?.usuario?.email || '',
      password: '',
      cooperativaTransporteId: cooperativaId,
    },
    validationSchema,
    onSubmit: (values) => {
      if (isEdit) {
        const updateDto: UpdateOficinistaDto = {};
        if (values.nombre) updateDto.nombre = values.nombre;
        if (values.apellido) updateDto.apellido = values.apellido;
        if (values.cedula) updateDto.cedula = values.cedula;
        if (values.telefono) updateDto.telefono = values.telefono;
        if (values.email) updateDto.email = values.email;
        if (values.password) updateDto.password = values.password;
        onSubmit(updateDto);
      } else {
        const createDto: CreateOficinistaDto = {
          nombre: values.nombre || '',
          apellido: values.apellido || '',
          cedula: values.cedula || '',
          telefono: values.telefono || '',
          email: values.email || '',
          password: values.password || '',
          cooperativaTransporteId: cooperativaId,
        };
        onSubmit(createDto);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!isEdit) formik.setFieldValue('password', '');
  }, [isEdit]);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, maxWidth: 500, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEdit ? 'Editar Oficinista' : 'Agregar Oficinista'}
      </Typography>
      <TextField fullWidth id="nombre" name="nombre" label="Nombre" value={formik.values.nombre} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.nombre && Boolean(formik.errors.nombre)} helperText={formik.touched.nombre && formik.errors.nombre} />
      <TextField fullWidth id="apellido" name="apellido" label="Apellido" value={formik.values.apellido} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.apellido && Boolean(formik.errors.apellido)} helperText={formik.touched.apellido && formik.errors.apellido} />
      <TextField fullWidth id="cedula" name="cedula" label="Cédula" value={formik.values.cedula} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.cedula && Boolean(formik.errors.cedula)} helperText={formik.touched.cedula && formik.errors.cedula} />
      <TextField fullWidth id="telefono" name="telefono" label="Teléfono" value={formik.values.telefono} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.telefono && Boolean(formik.errors.telefono)} helperText={formik.touched.telefono && formik.errors.telefono} />
      <TextField fullWidth id="email" name="email" label="Email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
      {!isEdit && (
        <TextField fullWidth id="password" name="password" label="Contraseña" type="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
      )}
      {isEdit && (
        <TextField fullWidth id="password" name="password" label="Nueva Contraseña (opcional)" type="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
      )}
      {isEdit && (
        <FormControlLabel
          control={<Switch id="activo" name="activo" checked={(formik.values as UpdateOficinistaDto).activo ?? false} onChange={formik.handleChange} color="primary" />}
          label="Activo"
        />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button color="secondary" variant="outlined" onClick={onCancel}>Cancelar</Button>
        <Button color="primary" variant="contained" type="submit">{isEdit ? 'Actualizar' : 'Agregar'}</Button>
      </Box>
    </Box>
  );
};

export default OficinistaForm; 
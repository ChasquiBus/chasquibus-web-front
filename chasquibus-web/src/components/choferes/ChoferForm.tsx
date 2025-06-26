import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { CreateChoferDto, UpdateChoferDto, Chofer } from '@/types/chofer';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Switch, 
  FormControlLabel, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl
} from '@mui/material';

interface ChoferFormProps {
  initialData?: Chofer | null;
  onSubmit: (values: CreateChoferDto | UpdateChoferDto) => void;
  onCancel: () => void;
  cooperativaId: number; // Prop para la cooperativaTransporteId
}

const ChoferForm: React.FC<ChoferFormProps> = ({ initialData, onSubmit, onCancel, cooperativaId }) => {
  const isEditMode = !!initialData;

  const validationSchema = yup.object({
    email: yup.string().email('Introduce un email válido').required('El email es obligatorio'),
    password: yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .test('password-required', 'La contraseña es obligatoria', function(value) {
        return isEditMode ? true : !!value; // En modo edición no es obligatoria, en creación sí
      }),
    nombre: yup.string().required('El nombre es obligatorio'),
    apellido: yup.string().required('El apellido es obligatorio'),
    cedula: yup.string().required('La cédula es obligatoria').matches(/^\d{10}$/, 'La cédula debe tener 10 dígitos'),
    telefono: yup.string().matches(/^\+?\d{10,15}$/, 'Introduce un teléfono válido (ej. +5939...)').optional(),
    activo: yup.boolean().required('El estado activo es obligatorio'),
    numeroLicencia: yup.string().required('El número de licencia es obligatorio'),
    tipoLicencia: yup.string().required('El tipo de licencia es obligatorio'),
    tipoSangre: yup.string().required('El tipo de sangre es obligatorio'),
    fechaNacimiento: yup.string().required('La fecha de nacimiento es obligatoria'),
    cooperativaTransporteId: yup.number().required('La ID de cooperativa es obligatoria'),
  });

  const initialFormValues = useMemo(() => {
    const defaults = {
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      cedula: '',
      telefono: '',
      activo: true,
      numeroLicencia: '',
      tipoLicencia: '',
      tipoSangre: '',
      fechaNacimiento: '',
      cooperativaTransporteId: cooperativaId,
    };

    if (initialData) {
      return {
        ...defaults,
        email: initialData.usuario?.email || defaults.email,
        nombre: initialData.usuario?.nombre || defaults.nombre,
        apellido: initialData.usuario?.apellido || defaults.apellido,
        cedula: initialData.usuario?.cedula || defaults.cedula,
        telefono: initialData.usuario?.telefono || defaults.telefono,
        activo: initialData.usuario?.activo ?? defaults.activo,
        numeroLicencia: initialData.numeroLicencia || defaults.numeroLicencia,
        tipoLicencia: initialData.tipoLicencia || defaults.tipoLicencia,
        tipoSangre: initialData.tipoSangre || defaults.tipoSangre,
        fechaNacimiento: initialData.fechaNacimiento?.split('T')[0] || defaults.fechaNacimiento,
      };
    }
    return defaults;
  }, [initialData, cooperativaId]);

  const formik = useFormik<CreateChoferDto | UpdateChoferDto>({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let dataToSend: CreateChoferDto | UpdateChoferDto;

      if (isEditMode) {
        const updateDto: UpdateChoferDto = { ...values };

        if (updateDto.password === '') {
          delete updateDto.password;
        }
        delete updateDto.cooperativaTransporteId;
        if (initialData?.fechaNacimiento?.split('T')[0] === updateDto.fechaNacimiento) {
            delete updateDto.fechaNacimiento;
        }

        dataToSend = updateDto;
      } else {
        const { cooperativaTransporteId, activo, ...rest } = values;
        dataToSend = { ...rest } as CreateChoferDto;
      }
      
      onSubmit(dataToSend);
    },
    enableReinitialize: true,
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mt: 2,
        maxWidth: 500,
        mx: 'auto',
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditMode ? 'Editar Chofer' : 'Crear Chofer'}
      </Typography>

      <TextField
        fullWidth
        id="email"
        name="email"
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        disabled={isEditMode} // No permitir cambiar el email en edición
      />

      {!isEditMode && (
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Contraseña"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
      )}

      <TextField
        fullWidth
        id="nombre"
        name="nombre"
        label="Nombre"
        value={formik.values.nombre}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
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
        onBlur={formik.handleBlur}
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
        onBlur={formik.handleBlur}
        error={formik.touched.cedula && Boolean(formik.errors.cedula)}
        helperText={formik.touched.cedula && formik.errors.cedula}
      />

      <TextField
        fullWidth
        id="telefono"
        name="telefono"
        label="Teléfono (ej. +5939...)"
        value={formik.values.telefono}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.telefono && Boolean(formik.errors.telefono)}
        helperText={formik.touched.telefono && formik.errors.telefono}
      />

      <FormControlLabel
        control={
          <Switch
            id="activo"
            name="activo"
            checked={formik.values.activo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            color="primary"
          />
        }
        label="Activo"
      />
      {formik.touched.activo && Boolean(formik.errors.activo) && (
        <Typography color="error" variant="caption">
          {formik.errors.activo}
        </Typography>
      )}

      <TextField
        fullWidth
        id="numeroLicencia"
        name="numeroLicencia"
        label="Número de Licencia"
        value={formik.values.numeroLicencia}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.numeroLicencia && Boolean(formik.errors.numeroLicencia)}
        helperText={formik.touched.numeroLicencia && formik.errors.numeroLicencia}
      />

      <FormControl fullWidth error={formik.touched.tipoLicencia && Boolean(formik.errors.tipoLicencia)}>
        <InputLabel id="tipoLicencia-label">Tipo de Licencia</InputLabel>
        <Select
          labelId="tipoLicencia-label"
          id="tipoLicencia"
          name="tipoLicencia"
          value={formik.values.tipoLicencia}
          label="Tipo de Licencia"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <MenuItem value="D">D</MenuItem>
          <MenuItem value="D1">D1</MenuItem>
          <MenuItem value="E">E</MenuItem>
        </Select>
        {formik.touched.tipoLicencia && Boolean(formik.errors.tipoLicencia) && (
          <Typography color="error" variant="caption">
            {formik.errors.tipoLicencia}
          </Typography>
        )}
      </FormControl>

      <FormControl fullWidth error={formik.touched.tipoSangre && Boolean(formik.errors.tipoSangre)}>
        <InputLabel id="tipoSangre-label">Tipo de Sangre</InputLabel>
        <Select
          labelId="tipoSangre-label"
          id="tipoSangre"
          name="tipoSangre"
          value={formik.values.tipoSangre}
          label="Tipo de Sangre"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <MenuItem value="O+">O+</MenuItem>
          <MenuItem value="O-">O-</MenuItem>
          <MenuItem value="A+">A+</MenuItem>
          <MenuItem value="A-">A-</MenuItem>
          <MenuItem value="B+">B+</MenuItem>
          <MenuItem value="B-">B-</MenuItem>
          <MenuItem value="AB+">AB+</MenuItem>
          <MenuItem value="AB-">AB-</MenuItem>
        </Select>
        {formik.touched.tipoSangre && Boolean(formik.errors.tipoSangre) && (
          <Typography color="error" variant="caption">
            {formik.errors.tipoSangre}
          </Typography>
        )}
      </FormControl>

      <TextField
        fullWidth
        id="fechaNacimiento"
        name="fechaNacimiento"
        label="Fecha de Nacimiento"
        type="date"
        value={formik.values.fechaNacimiento}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.fechaNacimiento && Boolean(formik.errors.fechaNacimiento)}
        helperText={formik.touched.fechaNacimiento && formik.errors.fechaNacimiento}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button color="secondary" variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
        <Button color="primary" variant="contained" type="submit">
          {isEditMode ? 'Actualizar' : 'Crear'}
        </Button>
      </Box>
    </Box>
  );
};

export default ChoferForm;

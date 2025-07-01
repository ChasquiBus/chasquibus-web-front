import React, { useMemo, useState, useEffect } from 'react';
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
import Grid from '@mui/material/Grid';
import * as validations from '@/lib/utils/validations';

interface ChoferFormProps {
  initialData?: Chofer | null;
  onSubmit: (values: CreateChoferDto | UpdateChoferDto) => void;
  onCancel: () => void;
  cooperativaId: number; // Prop para la cooperativaTransporteId
}

const ChoferForm: React.FC<ChoferFormProps> = ({ initialData, onSubmit, onCancel, cooperativaId }) => {
  const isEditMode = !!initialData;
  const [licenciaEditada, setLicenciaEditada] = useState(false);

  const validationSchema = yup.object({
    email: yup
      .string()
      .required('El email es obligatorio')
      .test('validar-email', 'Introduce un email válido', value => !value || validations.validarEmail(value)),
    password: yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .test('password-required', 'La contraseña es obligatoria', function(value) {
        return isEditMode ? true : !!value;
      }),
    nombre: yup.string().required('El nombre es obligatorio'),
    apellido: yup.string().required('El apellido es obligatorio'),
    cedula: yup
      .string()
      .required('La cédula es obligatoria')
      .test('validar-cedula', 'La cédula no es válida', value => !value || validations.validarCedulaEcuador(value)),
    telefono: yup
      .string()
      .optional()
      .test('validar-telefono', 'Introduce un teléfono válido (ej. 09XXXXXXXX)', value => !value || validations.validarCelularEcuador(value)),
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
        const { cooperativaTransporteId, ...rest } = values;
        dataToSend = { ...rest } as CreateChoferDto;
      }
      
      onSubmit(dataToSend);
    },
    enableReinitialize: true,
  });

  // Calcular la fecha máxima y mínima permitida (edad mínima 19, máxima 70)
  const getMaxDateNacimiento = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 19);
    return today.toISOString().split('T')[0];
  };
  const getMinDateNacimiento = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 70);
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (formik.values.numeroLicencia === '' || formik.values.numeroLicencia === formik.initialValues.numeroLicencia) {
      setLicenciaEditada(false);
    }
  }, [formik.values.numeroLicencia, formik.initialValues.numeroLicencia]);

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        mt: 2,
        maxWidth: 700,
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
      <Grid container spacing={2}>
        <Box sx={{ width: '100%', maxWidth: 350, flex: 1, minWidth: 200, m: 1 }}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            placeholder="ejemplo@correo.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={isEditMode}
          />
        </Box>
        <Box sx={{ width: '100%', maxWidth: 350, flex: 1, minWidth: 200, m: 1 }}>
          {!isEditMode && (
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Contraseña"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          )}
        </Box>
        <Box sx={{ width: '100%', maxWidth: 350, flex: 1, minWidth: 200, m: 1 }}>
          <TextField
            fullWidth
            id="nombre"
            name="nombre"
            label="Nombre"
            placeholder="Nombres completos"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
            helperText={formik.touched.nombre && formik.errors.nombre}
          />
        </Box>
        <Box sx={{ width: '100%', maxWidth: 350, flex: 1, minWidth: 200, m: 1 }}>
          <TextField
            fullWidth
            id="apellido"
            name="apellido"
            label="Apellido"
            placeholder="Apellidos completos"
            value={formik.values.apellido}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.apellido && Boolean(formik.errors.apellido)}
            helperText={formik.touched.apellido && formik.errors.apellido}
          />
        </Box>
        <Box sx={{ width: '100%', maxWidth: 350, flex: 1, minWidth: 200, m: 1 }}>
          <TextField
            fullWidth
            id="cedula"
            name="cedula"
            label="Cédula"
            placeholder="Ej: 1724727225"
            value={formik.values.cedula}
            onChange={e => {
              formik.handleChange(e);
              if (!licenciaEditada) {
                formik.setFieldValue('numeroLicencia', e.target.value);
              }
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.cedula && Boolean(formik.errors.cedula)}
            helperText={formik.touched.cedula && formik.errors.cedula}
          />
        </Box>
        <Box sx={{ width: '100%', maxWidth: 350, flex: 1, minWidth: 200, m: 1 }}>
          <TextField
            fullWidth
            id="telefono"
            name="telefono"
            label="Celular"
            placeholder="Ej: 0984266777"
            value={formik.values.telefono}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.telefono && Boolean(formik.errors.telefono)}
            helperText={formik.touched.telefono && formik.errors.telefono}
          />
        </Box>
        <Box sx={{ width: '100%', maxWidth: 350, flex: 1, minWidth: 200, m: 1 }}>
          <TextField
            fullWidth
            id="numeroLicencia"
            name="numeroLicencia"
            label="Número de Licencia"
            placeholder="Ej: 1724727225"
            value={formik.values.numeroLicencia}
            onChange={e => {
              setLicenciaEditada(true);
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.numeroLicencia && Boolean(formik.errors.numeroLicencia)}
            helperText={formik.touched.numeroLicencia && formik.errors.numeroLicencia}
          />
        </Box>
        <Box sx={{ width: '100%', maxWidth: 350, flex: 1, minWidth: 200, m: 1 }}>
          <FormControl fullWidth error={formik.touched.tipoLicencia && Boolean(formik.errors.tipoLicencia)}>
            <InputLabel id="tipoLicencia-label" shrink={true}>Tipo de Licencia</InputLabel>
            <Select
              labelId="tipoLicencia-label"
              id="tipoLicencia"
              name="tipoLicencia"
              value={formik.values.tipoLicencia}
              label="Tipo de Licencia"
              displayEmpty
              renderValue={selected => selected ? selected : 'Selecciona el tipo de licencia'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="" disabled>
                Selecciona el tipo de licencia
              </MenuItem>
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
        </Box>
        <Box sx={{ width: '100%', maxWidth: 350, flex: 1, minWidth: 200, m: 1 }}>
          <FormControl fullWidth error={formik.touched.tipoSangre && Boolean(formik.errors.tipoSangre)}>
            <InputLabel id="tipoSangre-label" shrink={true}>Tipo de Sangre</InputLabel>
            <Select
              labelId="tipoSangre-label"
              id="tipoSangre"
              name="tipoSangre"
              value={formik.values.tipoSangre}
              label="Tipo de Sangre"
              displayEmpty
              renderValue={selected => selected ? selected : 'Selecciona el tipo de sangre'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="" disabled>
                Selecciona el tipo de sangre
              </MenuItem>
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
        </Box>
        <Box sx={{ width: '100%', maxWidth: 350, flex: 1, minWidth: 200, m: 1 }}>
          <TextField
            fullWidth
            id="fechaNacimiento"
            name="fechaNacimiento"
            label="Fecha de Nacimiento"
            type="date"
            placeholder="dd/mm/aaaa"
            value={formik.values.fechaNacimiento}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fechaNacimiento && Boolean(formik.errors.fechaNacimiento)}
            helperText={formik.touched.fechaNacimiento && formik.errors.fechaNacimiento}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: getMinDateNacimiento(),
              max: getMaxDateNacimiento(),
            }}
          />
        </Box>
      </Grid>
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

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Alert,
  Typography,
  MenuItem,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CreateBusDto } from '@/types/bus';
import { formatearPlacaEcuador, validarPlacaEcuador, validarTotalAsientosPiso1, validarSumaAsientosPisos } from '@/lib/utils/validations';

interface BusFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateBusDto, imagen?: File) => Promise<void>;
  initialValues?: Partial<CreateBusDto>;
  title: string;
  cooperativaId: number;
  busesExistentes?: { numero_bus: string }[];
}

const validationSchema = Yup.object().shape({
  placa: Yup.string()
    .required('La placa es requerida')
    .max(10, 'La placa no puede tener más de 10 caracteres'),
  numero_bus: Yup.string()
    .required('El número de bus es requerido')
    .max(10, 'El número de bus no puede tener más de 10 caracteres'),
  marca_chasis: Yup.string()
    .max(50, 'La marca del chasis no puede tener más de 50 caracteres'),
  marca_carroceria: Yup.string()
    .max(50, 'La marca de la carrocería no puede tener más de 50 caracteres'),
  piso_doble: Yup.boolean().required(),
  total_asientos: Yup.number()
    .required('El total de asientos es requerido')
    .min(1, 'Debe tener al menos 1 asiento')
    .max(100, 'No puede tener más de 100 asientos'),
  activo: Yup.boolean(),
  total_asientos_piso2: Yup.number().when('piso_doble', {
    is: true,
    then: (schema) =>
      schema
        .required('El total de asientos del piso 2 es requerido para buses de doble piso')
        .min(1, 'Debe tener al menos 1 asiento en el piso 2')
        .max(100, 'No puede tener más de 100 asientos en el piso 2'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
});

const CHASIS_OPTIONS = [
  'HINO',
  'MERCEDES-BENZ',
  'SCANIA',
  'VOLVO',
  'HYUNDAI',
];
const CARROCERIA_OPTIONS = [
  'Marcopolo',
  'Carrocerías Cepeda',
  'BUSCARS',
  'IMETAM C.A.',
  'Industrias MIRAL',
];

export default function BusForm({
  open,
  onClose,
  onSubmit,
  initialValues,
  title,
  cooperativaId,
  busesExistentes,
}: BusFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: CreateBusDto, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      setError(null);
      // Validación local antes de enviar
      const piso1 = Number(values.total_asientos);
      const piso2 = Number(values.total_asientos_piso2) || 0;
      if (!validarTotalAsientosPiso1(piso1)) {
        setError('El total de asientos del piso 1 debe ser un número entre 1 y 50.');
        setSubmitting(false);
        return;
      }
      if (values.piso_doble && !validarSumaAsientosPisos(piso1, piso2)) {
        setError('La suma de asientos de ambos pisos no puede exceder 80 para un bus de dos pisos.');
        setSubmitting(false);
        return;
      }
      if (busesExistentes && values.numero_bus) {
        const existe = busesExistentes.some(b => {
          return b.numero_bus === values.numero_bus || String(b.numero_bus) === String(values.numero_bus);
        });
        if (existe) {
          setError('Ya existe un bus con ese número. Elija otro número de bus.');
          setSubmitting(false);
          return;
        }
      }
      await onSubmit({ ...values, cooperativa_id: cooperativaId }, selectedImage || undefined);
      onClose();
    } catch (err: any) {
      let mensaje = '';
      // Caso 1: error tipo Response (fetch)
      if (err instanceof Response) {
        try {
          const data = await err.json();
          if (data && typeof data === 'object') {
            if (data.message) {
              mensaje = Array.isArray(data.message) ? data.message.join(' ') : data.message;
            } else if (typeof data.error === 'string') {
              mensaje = data.error;
            }
          } else if (typeof data === 'string') {
            mensaje = data;
          }
        } catch {}
      }
      // Caso 2: error tipo Axios o similar
      if (!mensaje && err && err.response && err.response.data) {
        const data = err.response.data;
        if (data.message) {
          mensaje = Array.isArray(data.message) ? data.message.join(' ') : data.message;
        } else if (typeof data.error === 'string') {
          mensaje = data.error;
        }
      }
      // Caso 3: error.message
      if (!mensaje && err && err.message) {
        mensaje = err.message;
      }
      // Fallback
      if (!mensaje) mensaje = 'Error al crear el bus. Por favor, intente nuevamente.';
      setError(mensaje);
      setSubmitting(false);
      return;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <Formik
        initialValues={{
          cooperativa_id: cooperativaId,
          placa: initialValues?.placa || '',
          numero_bus: initialValues?.numero_bus || '',
          marca_chasis: initialValues?.marca_chasis || '',
          marca_carroceria: initialValues?.marca_carroceria || '',
          piso_doble: initialValues?.piso_doble || false,
          total_asientos: initialValues?.total_asientos || 45,
          activo: initialValues?.activo ?? true,
          total_asientos_piso2: initialValues?.total_asientos_piso2 || (initialValues?.piso_doble ? 20 : undefined),
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
          <Form>
            <DialogContent>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  name="placa"
                  label="Placa"
                  value={values.placa}
                  placeholder="Ej: PBC-1234"
                  onChange={e => {
                    const formateada = formatearPlacaEcuador(e.target.value);
                    setFieldValue('placa', formateada);
                  }}
                  onBlur={handleBlur}
                  error={touched.placa && Boolean(errors.placa)}
                  helperText={touched.placa && errors.placa ? errors.placa : 'Formato: AAA-1234 (3 letras, guion, 4 números)'}
                  inputProps={{ maxLength: 8, style: { textTransform: 'uppercase', letterSpacing: 2 } }}
                />

                <TextField
                  fullWidth
                  name="numero_bus"
                  label="Número de Bus"
                  value={values.numero_bus}
                  placeholder="Ej: 123"
                  onChange={e => {
                    let val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length > 3) val = val.slice(0, 3);
                    val = val.replace(/^0+/, '');
                    if (val !== '' && (parseInt(val, 10) < 1 || parseInt(val, 10) > 999)) return;
                    setFieldValue('numero_bus', val);
                  }}
                  onBlur={handleBlur}
                  error={touched.numero_bus && Boolean(errors.numero_bus)}
                  helperText={touched.numero_bus && errors.numero_bus ? errors.numero_bus : 'Solo números del 1 al 999'}
                  inputProps={{ maxLength: 3, inputMode: 'numeric', pattern: '[0-9]*' }}
                />

                <TextField
                  fullWidth
                  select
                  name="marca_chasis"
                  label="Marca del Chasis"
                  value={values.marca_chasis}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.marca_chasis && Boolean(errors.marca_chasis)}
                  helperText={touched.marca_chasis && errors.marca_chasis}
                >
                  {CHASIS_OPTIONS.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  select
                  name="marca_carroceria"
                  label="Marca de la Carrocería"
                  value={values.marca_carroceria}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.marca_carroceria && Boolean(errors.marca_carroceria)}
                  helperText={touched.marca_carroceria && errors.marca_carroceria}
                >
                  {CARROCERIA_OPTIONS.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  name="total_asientos"
                  label="Total Asientos Piso 1"
                  type="number"
                  value={values.total_asientos}
                  placeholder="Ej: 45"
                  onChange={e => {
                    let val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length > 2) val = val.slice(0, 2);
                    // No permitir negativos ni ceros
                    if (val !== '' && (parseInt(val, 10) < 1 || parseInt(val, 10) > 50)) return;
                    setFieldValue('total_asientos', val);
                  }}
                  onBlur={handleBlur}
                  error={touched.total_asientos && Boolean(errors.total_asientos)}
                  helperText={touched.total_asientos && errors.total_asientos ? errors.total_asientos : 'Solo números del 1 al 50'}
                  inputProps={{ min: 1, max: 50, inputMode: 'numeric', pattern: '[0-9]*' }}
                />

                <Box>
                  <input
                    accept="image/*"
                    type="file"
                    id="imagen-bus"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="imagen-bus">
                    <Button variant="outlined" component="span">
                      {selectedImage ? 'Cambiar Imagen' : 'Subir Imagen'}
                    </Button>
                  </label>
                  {previewUrl && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                      />
                    </Box>
                  )}
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      name="piso_doble"
                      checked={values.piso_doble}
                      onChange={handleChange}
                    />
                  }
                  label="Bus de Piso Doble"
                />

                {values.piso_doble && (
                  <TextField
                    fullWidth
                    name="total_asientos_piso2"
                    label="Total de Asientos (Piso 2)"
                    type="number"
                    value={values.total_asientos_piso2 || ''}
                    onChange={e => {
                      let val = e.target.value.replace(/[^0-9]/g, '');
                      if (val.length > 2) val = val.slice(0, 2);
                      if (val !== '' && (parseInt(val, 10) < 1 || parseInt(val, 10) > 30)) return;
                      setFieldValue('total_asientos_piso2', val);
                    }}
                    onBlur={handleBlur}
                    error={touched.total_asientos_piso2 && Boolean(errors.total_asientos_piso2)}
                    helperText={touched.total_asientos_piso2 && errors.total_asientos_piso2 ? errors.total_asientos_piso2 : 'Solo números del 1 al 30'}
                    inputProps={{ min: 1, max: 30, inputMode: 'numeric', pattern: '[0-9]*' }}
                  />
                )}

                <FormControlLabel
                  control={
                    <Switch
                      name="activo"
                      checked={values.activo}
                      onChange={handleChange}
                    />
                  }
                  label="Bus Activo"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancelar</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
} 
// src/components/buses/BusForm.tsx
import React from 'react';
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
  Typography,
  Alert,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { CreateBusDto } from '@/types/bus';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface BusFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateBusDto) => Promise<void>;
  initialValues?: Partial<CreateBusDto>;
  title: string;
  cooperativas: { id: number; nombre: string }[];
  choferes: { id: number; nombre: string; apellido: string }[];
}

const validationSchema = Yup.object({
  cooperativa_id: Yup.number().required('La cooperativa es requerida'),
  chofer_id: Yup.number().required('El chofer es requerido'),
  placa: Yup.string().required('La placa es requerida'),
  numero_bus: Yup.string().required('El número de bus es requerido'),
  marca_chasis: Yup.string(),
  marca_carroceria: Yup.string(),
  imagen: Yup.mixed(),
  piso_doble: Yup.boolean(),
});

export default function BusForm({
  open,
  onClose,
  onSubmit,
  initialValues,
  title,
  cooperativas,
  choferes,
}: BusFormProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (initialValues?.imagen) {
      setPreviewImage(`${API_URL}/${initialValues.imagen}`);
    } else {
      setPreviewImage(null);
    }
  }, [initialValues]);

  const handleSubmit = async (values: CreateBusDto, { setSubmitting }: any) => {
    try {
      setError(null);
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError('Error al guardar el bus. Por favor, intente nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <Formik
        initialValues={{
          cooperativa_id: initialValues?.cooperativa_id || '',
          chofer_id: initialValues?.chofer_id || '',
          placa: initialValues?.placa || '',
          numero_bus: initialValues?.numero_bus || '',
          marca_chasis: initialValues?.marca_chasis || '',
          marca_carroceria: initialValues?.marca_carroceria || '',
          piso_doble: initialValues?.piso_doble || false,
          imagen: undefined, // File input is managed separately
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <DialogContent>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  select
                  fullWidth
                  name="cooperativa_id"
                  label="Cooperativa"
                  value={values.cooperativa_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.cooperativa_id && Boolean(errors.cooperativa_id)}
                  helperText={touched.cooperativa_id && errors.cooperativa_id}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Seleccione una cooperativa</option>
                  {cooperativas.map((cooperativa) => (
                    <option key={cooperativa.id} value={cooperativa.id}>
                      {cooperativa.nombre}
                    </option>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  name="chofer_id"
                  label="Chofer"
                  value={values.chofer_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.chofer_id && Boolean(errors.chofer_id)}
                  helperText={touched.chofer_id && errors.chofer_id}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Seleccione un chofer</option>
                  {choferes.map((chofer) => (
                    <option key={chofer.id} value={chofer.id}>
                      {`${chofer.nombre} ${chofer.apellido}`}
                    </option>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  name="placa"
                  label="Placa"
                  value={values.placa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.placa && Boolean(errors.placa)}
                  helperText={touched.placa && errors.placa}
                />

                <TextField
                  fullWidth
                  name="numero_bus"
                  label="Número de Bus"
                  value={values.numero_bus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.numero_bus && Boolean(errors.numero_bus)}
                  helperText={touched.numero_bus && errors.numero_bus}
                />

                <TextField
                  fullWidth
                  name="marca_chasis"
                  label="Marca del Chasis"
                  value={values.marca_chasis}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.marca_chasis && Boolean(errors.marca_chasis)}
                  helperText={touched.marca_chasis && errors.marca_chasis}
                />

                <TextField
                  fullWidth
                  name="marca_carroceria"
                  label="Marca de la Carrocería"
                  value={values.marca_carroceria}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.marca_carroceria && Boolean(errors.marca_carroceria)}
                  helperText={touched.marca_carroceria && errors.marca_carroceria}
                />

                <Box sx={{ mt: 1 }}>
                  {previewImage && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Imagen actual:
                      </Typography>
                      <img
                        src={previewImage}
                        alt="Current bus image"
                        style={{
                          width: '120px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    </Box>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      if (file) {
                        handleChange({
                          target: {
                            name: 'imagen',
                            value: file,
                          },
                        });
                        // Update preview
                        const reader = new FileReader();
                        reader.onload = () => {
                          setPreviewImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                    id="imagen-upload"
                  />
                  <label htmlFor="imagen-upload">
                    <Button variant="outlined" component="span" fullWidth>
                      {previewImage ? 'Cambiar Imagen del Bus' : 'Subir Imagen del Bus'}
                    </Button>
                  </label>
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
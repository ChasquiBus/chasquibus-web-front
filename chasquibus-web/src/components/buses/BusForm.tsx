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
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CreateBusDto } from '@/types/bus';

interface BusFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateBusDto, imagen?: File) => Promise<void>;
  initialValues?: Partial<CreateBusDto>;
  title: string;
  cooperativaId: number;
}

const validationSchema = Yup.object({
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
});

export default function BusForm({
  open,
  onClose,
  onSubmit,
  initialValues,
  title,
  cooperativaId,
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

  const handleSubmit = async (values: CreateBusDto, { setSubmitting }: any) => {
    try {
      setError(null);
      await onSubmit({ ...values, cooperativa_id: cooperativaId }, selectedImage || undefined);
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
          cooperativa_id: cooperativaId,
          placa: initialValues?.placa || '',
          numero_bus: initialValues?.numero_bus || '',
          marca_chasis: initialValues?.marca_chasis || '',
          marca_carroceria: initialValues?.marca_carroceria || '',
          piso_doble: initialValues?.piso_doble || false,
          total_asientos: initialValues?.total_asientos || 45,
          activo: initialValues?.activo ?? true,
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

                <TextField
                  fullWidth
                  name="total_asientos"
                  label="Total de Asientos"
                  type="number"
                  value={values.total_asientos}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.total_asientos && Boolean(errors.total_asientos)}
                  helperText={touched.total_asientos && errors.total_asientos}
                  inputProps={{ min: 1, max: 100 }}
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
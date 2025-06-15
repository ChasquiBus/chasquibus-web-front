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
  Alert,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CreateBusDto } from '@/types/bus';

interface BusFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateBusDto) => Promise<void>;
  initialValues?: Partial<CreateBusDto>;
  title: string;
  cooperativaId: number; // Ahora se recibe la cooperativaId directamente
}

const validationSchema = Yup.object({
  placa: Yup.string().required('La placa es requerida'),
  numero_bus: Yup.string().required('El número de bus es requerido'),
  marca_chasis: Yup.string(),
  marca_carroceria: Yup.string(),
  piso_doble: Yup.boolean().required(),
  total_asientos: Yup.number()
    .required('El total de asientos es requerido')
    .min(1, 'Debe tener al menos 1 asiento')
    .max(100, 'No puede tener más de 100 asientos'),
});

export default function BusForm({
  open,
  onClose,
  onSubmit,
  initialValues,
  title,
  cooperativaId,
}: BusFormProps) {
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (values: CreateBusDto, { setSubmitting }: any) => {
    try {
      setError(null);
      // El cooperativa_id se añade aquí directamente desde las props
      await onSubmit({ ...values, cooperativa_id: cooperativaId });
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
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <DialogContent>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* El campo cooperativa_id ya no es necesario aquí, se obtiene del token */}

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
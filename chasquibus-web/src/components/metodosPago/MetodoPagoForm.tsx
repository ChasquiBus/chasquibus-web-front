import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';

interface MetodoPagoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialValues?: any;
  cooperativaId: number;
  isEdit?: boolean;
  loading?: boolean;
}

const MetodoPagoForm: React.FC<MetodoPagoFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  cooperativaId,
  isEdit = false,
  loading = false,
}) => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    procesador: '',
    configuracion: '',
    activo: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setForm({
        nombre: initialValues.nombre || '',
        descripcion: initialValues.descripcion || '',
        procesador: initialValues.procesador || '',
        configuracion: initialValues.configuracion || '',
        activo: initialValues.activo !== undefined ? initialValues.activo : true,
      });
    } else {
      setForm({ nombre: '', descripcion: '', procesador: '', configuracion: '', activo: true });
    }
    setError('');
  }, [initialValues, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || form.nombre.length > 100) {
      setError('El nombre es obligatorio y debe tener máximo 100 caracteres.');
      return;
    }
    if (form.descripcion && form.descripcion.length > 255) {
      setError('La descripción debe tener máximo 255 caracteres.');
      return;
    }
    if (form.procesador && form.procesador.length > 100) {
      setError('El procesador debe tener máximo 100 caracteres.');
      return;
    }
    // configuracion es string, puede ser JSON como texto
    let configuracionVal = form.configuracion;
    if (configuracionVal) {
      try {
        JSON.parse(configuracionVal);
      } catch {
        setError('La configuración debe ser un JSON válido.');
        return;
      }
    }
    setError('');
    const data = {
      ...form,
      cooperativaId,
    };
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{isEdit ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nombre *"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            inputProps={{ maxLength: 100 }}
            required
            fullWidth
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            inputProps={{ maxLength: 255 }}
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label="Procesador (Banco, Caja, etc.)"
            name="procesador"
            value={form.procesador}
            onChange={handleChange}
            inputProps={{ maxLength: 100 }}
            fullWidth
          />
          <TextField
            label="Configuración (JSON como texto)"
            name="configuracion"
            value={form.configuracion}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={2}
            placeholder='Ejemplo: {"cuenta": "123456", "tipo": "ahorros"}'
          />
          <FormControlLabel
            control={<Switch checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} name="activo" color="primary" />}
            label="¿Activo?"
          />
          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>{isEdit ? 'Actualizar' : 'Crear'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MetodoPagoForm; 
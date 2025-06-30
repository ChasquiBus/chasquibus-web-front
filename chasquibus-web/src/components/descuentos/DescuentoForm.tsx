import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch, MenuItem } from '@mui/material';
import { CreateDescuentoDto, UpdateDescuentoDto, Descuento } from '@/services/descuentos';

interface DescuentoFormProps {
  initialValues?: Partial<CreateDescuentoDto | UpdateDescuentoDto>;
  onSubmit: (data: CreateDescuentoDto | UpdateDescuentoDto) => void;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

const estados = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
];

export default function DescuentoForm({ initialValues, onSubmit, onCancel, loading, isEdit }: DescuentoFormProps) {
  const [form, setForm] = useState<Partial<CreateDescuentoDto | UpdateDescuentoDto>>({
    tipoDescuento: '',
    requiereValidacion: false,
    porcentaje: '',
    estado: 'activo',
  });

  useEffect(() => {
    if (initialValues) setForm(initialValues);
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tipoDescuento || form.porcentaje === '' || !form.estado) return;
    const data = {
      ...form,
      porcentaje: Number(form.porcentaje),
    };
    onSubmit(data as CreateDescuentoDto | UpdateDescuentoDto);
  };

  return (
    <Dialog open onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{isEdit ? 'Editar Descuento' : 'Nuevo Descuento'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Tipo de Descuento"
            name="tipoDescuento"
            value={form.tipoDescuento}
            onChange={handleChange}
            inputProps={{ maxLength: 100 }}
            required
            fullWidth
          />
          <FormControlLabel
            control={<Switch checked={!!form.requiereValidacion} onChange={e => setForm(f => ({ ...f, requiereValidacion: e.target.checked }))} />}
            label="¿Requiere validación?"
          />
          <TextField
            label="Porcentaje (%)"
            name="porcentaje"
            type="number"
            value={form.porcentaje}
            onChange={handleChange}
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            required
            fullWidth
          />
          <TextField
            select
            label="Estado"
            name="estado"
            value={form.estado}
            onChange={handleChange}
            required
            fullWidth
          >
            {estados.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="secondary">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>{isEdit ? 'Actualizar' : 'Crear'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, FormControlLabel, Switch, Alert, Grid, Box
} from '@mui/material';
import { TarifaParada, CreateTarifaParadaDto, UpdateTarifaParadaDto } from '@/services/tarifasParadas';

interface TarifaFormProps {
  open: boolean;
  rutas: { id: number; nombre: string }[];
  paradas: { id: number; nombreParada: string }[];
  initialValues?: Partial<TarifaParada>;
  onSave: (data: CreateTarifaParadaDto | UpdateTarifaParadaDto) => void;
  onClose: () => void;
  isEdit?: boolean;
}

const tiposAsiento = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'VIP', label: 'VIP' },
];

const TarifaForm: React.FC<TarifaFormProps> = ({ open, rutas, paradas, initialValues, onSave, onClose, isEdit }) => {
  const [form, setForm] = useState<{
    rutaId: string;
    paradaOrigenId: string;
    paradaDestinoId: string;
    tipoAsiento: string;
    valor: string;
    aplicaTarifa: boolean;
  }>({
    rutaId: '',
    paradaOrigenId: '',
    paradaDestinoId: '',
    tipoAsiento: '',
    valor: '',
    aplicaTarifa: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setForm({
        rutaId: initialValues.rutaId !== undefined ? String(initialValues.rutaId) : '',
        paradaOrigenId: initialValues.paradaOrigenId !== undefined ? String(initialValues.paradaOrigenId) : '',
        paradaDestinoId: initialValues.paradaDestinoId !== undefined ? String(initialValues.paradaDestinoId) : '',
        tipoAsiento: initialValues.tipoAsiento ?? '',
        valor: initialValues.valor !== undefined ? String(initialValues.valor) : '',
        aplicaTarifa: initialValues.aplicaTarifa ?? true,
      });
    } else {
      setForm({ rutaId: '', paradaOrigenId: '', paradaDestinoId: '', tipoAsiento: '', valor: '', aplicaTarifa: true });
    }
    setError('');
  }, [initialValues, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: String(value) }));
    }
  };

  const handleSave = () => {
    // Validaciones
    if (!isEdit && (!form.rutaId || !form.paradaOrigenId || !form.paradaDestinoId || !form.valor)) {
      setError('Todos los campos obligatorios deben estar completos.');
      return;
    }
    if (Number(form.valor) <= 0) {
      setError('El valor debe ser mayor a 0.');
      return;
    }
    if (Number(form.valor) > 100) {
      setError('El valor no puede ser mayor a 100.');
      return;
    }
    if (form.tipoAsiento && String(form.tipoAsiento).length > 10) {
      setError('El tipo de asiento no puede superar 10 caracteres.');
      return;
    }
    if (form.paradaOrigenId === form.paradaDestinoId) {
      setError('La parada de origen y destino no pueden ser iguales.');
      return;
    }
    setError('');
    // Construir el objeto según si es edición o creación
    if (isEdit) {
      const data: UpdateTarifaParadaDto = {
        tipoAsiento: form.tipoAsiento || undefined,
        valor: form.valor !== undefined ? Number(form.valor) : undefined,
        aplicaTarifa: form.aplicaTarifa,
      };
      onSave(data);
    } else {
      const data: CreateTarifaParadaDto = {
        rutaId: Number(form.rutaId),
        paradaOrigenId: Number(form.paradaOrigenId),
        paradaDestinoId: Number(form.paradaDestinoId),
        tipoAsiento: form.tipoAsiento || undefined,
        valor: Number(form.valor),
        aplicaTarifa: form.aplicaTarifa,
      };
      onSave(data);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, textAlign: 'center', pb: 1 }}>{isEdit ? 'Agregar precio' : 'Agregar Tarifa'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, pb: 0 }}>
        <Box sx={{ padding: 1, display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, justifyContent: 'center', width: '100%' }}>
          {!isEdit && (
            <TextField
              select
              label="Ruta *"
              name="rutaId"
              value={form.rutaId}
              onChange={handleChange}
              size="small"
              sx={{ minWidth: 170, background: '#fff' }}
              required
            >
              {rutas.map((ruta) => {
                // Si no existen origenId/destinoId, solo muestra el nombre
                // (esto es para evitar el error de linter)
                // Si existen, muestra el formato completo
                // @ts-ignore
                const origen = 'origenId' in ruta ? paradas.find(p => p.id === ruta.origenId)?.nombreParada : '';
                // @ts-ignore
                const destino = 'destinoId' in ruta ? paradas.find(p => p.id === ruta.destinoId)?.nombreParada : '';
                // @ts-ignore
                if ('origenId' in ruta && 'destinoId' in ruta) {
                  return (
                    <MenuItem key={ruta.id} value={ruta.id}>
                      {`Ruta ${ruta.id} (${origen} - ${destino})`}
                    </MenuItem>
                  );
                }
                return (
                  <MenuItem key={ruta.id} value={ruta.id}>
                    {ruta.nombre || `Ruta ${ruta.id}`}
                  </MenuItem>
                );
              })}
            </TextField>
          )}
          {!isEdit && (
            <TextField
              select
              label="Origen *"
              name="paradaOrigenId"
              value={form.paradaOrigenId}
              onChange={handleChange}
              size="small"
              sx={{ minWidth: 170, background: '#fff' }}
              required
            >
              {paradas.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.nombreParada}</MenuItem>
              ))}
            </TextField>
          )}
          {!isEdit && (
            <TextField
              select
              label="Destino *"
              name="paradaDestinoId"
              value={form.paradaDestinoId}
              onChange={handleChange}
              size="small"
              sx={{ minWidth: 170, background: '#fff' }}
              required
            >
              {paradas.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.nombreParada}</MenuItem>
              ))}
            </TextField>
          )}
          <TextField
            select
            label="Tipo de Asiento"
            name="tipoAsiento"
            value={form.tipoAsiento}
            onChange={handleChange}
            size="small"
            sx={{ minWidth: 240, background: '#fff' }}
            helperText="Opcional"
            disabled={isEdit}
          >
            <MenuItem value="">-</MenuItem>
            {tiposAsiento.map((tipo) => (
              <MenuItem key={tipo.value} value={tipo.value}>{tipo.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Valor *"
            name="valor"
            type="number"
            value={form.valor}
            onChange={handleChange}
            size="small"
            sx={{ minWidth: 240, background: '#fff' }}
            required
            inputProps={{ step: '0.01', min: 0, max: 100 }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={!!form.aplicaTarifa}
                onChange={e => setForm((prev) => ({ ...prev, aplicaTarifa: e.target.checked }))}
                name="aplicaTarifa"
                color="primary"
              />
            }
            label={<span style={{ fontWeight: 500 }}>¿Tarifa activa?</span>}
            sx={{ ml: 1 }}
          />
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'center' }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary" sx={{ fontWeight: 700, boxShadow: 2 }}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TarifaForm; 
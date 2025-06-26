import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Select, InputLabel, FormControl, Checkbox, ListItemText, FormControlLabel, Switch, DialogActions } from '@mui/material';
import { Parada } from '@/services/paradas';
import { DiaOperacion } from '@/services/rutas';

const DIAS_SEMANA = [
  { diaId: 1, nombre: 'Lunes' },
  { diaId: 2, nombre: 'Martes' },
  { diaId: 3, nombre: 'Miércoles' },
  { diaId: 4, nombre: 'Jueves' },
  { diaId: 5, nombre: 'Viernes' },
  { diaId: 6, nombre: 'Sábado' },
  { diaId: 7, nombre: 'Domingo' },
];

interface RutaFormProps {
  paradas: Parada[];
  rutaInicial?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const RutaForm: React.FC<RutaFormProps> = ({ paradas, rutaInicial, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState<any>({
    paradaOrigenId: '',
    paradaDestinoId: '',
    prioridad: '',
    fechaIniVigencia: '',
    fechaFinVigencia: '',
    estado: true,
    diasOperacion: [],
    file: null,
  });
  const [diasSeleccionados, setDiasSeleccionados] = useState<number[]>([]);

  useEffect(() => {
    if (rutaInicial) {
      setForm({
        paradaOrigenId: rutaInicial.paradaOrigenId,
        paradaDestinoId: rutaInicial.paradaDestinoId,
        prioridad: rutaInicial.prioridad || '',
        fechaIniVigencia: rutaInicial.fechaIniVigencia || '',
        fechaFinVigencia: rutaInicial.fechaFinVigencia || '',
        estado: rutaInicial.estado ?? true,
        diasOperacion: rutaInicial.diasOperacion || [],
        file: null,
      });
      setDiasSeleccionados(rutaInicial.diasOperacion.map((d: DiaOperacion) => d.diaId));
    } else {
      setForm({ paradaOrigenId: '', paradaDestinoId: '', prioridad: '', fechaIniVigencia: '', fechaFinVigencia: '', estado: true, diasOperacion: [], file: null });
      setDiasSeleccionados([]);
    }
  }, [rutaInicial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm((prev: any) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setForm((prev: any) => ({ ...prev, file: files[0] }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleDiasChange = (event: any) => {
    const value = event.target.value;
    setDiasSeleccionados(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const diasOperacion: DiaOperacion[] = diasSeleccionados.map(diaId => ({ diaId, tipo: 'operacion' }));
    const payload = {
      ...form,
      paradaOrigenId: Number(form.paradaOrigenId),
      paradaDestinoId: Number(form.paradaDestinoId),
      prioridad: form.prioridad ? Number(form.prioridad) : undefined,
      estado: Boolean(form.estado),
      diasOperacion,
      file: form.file,
    };
    onSubmit(payload);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth required>
        <InputLabel>Parada Origen</InputLabel>
        <Select
          name="paradaOrigenId"
          value={form.paradaOrigenId}
          onChange={handleChange}
          label="Parada Origen"
        >
          {paradas.map((p) => (
            <MenuItem key={p.id} value={p.id}>{p.nombreParada}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Parada Destino</InputLabel>
        <Select
          name="paradaDestinoId"
          value={form.paradaDestinoId}
          onChange={handleChange}
          label="Parada Destino"
        >
          {paradas.map((p) => (
            <MenuItem key={p.id} value={p.id}>{p.nombreParada}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Días de Operación</InputLabel>
        <Select
          multiple
          value={diasSeleccionados}
          onChange={handleDiasChange}
          renderValue={(selected) => DIAS_SEMANA.filter(d => selected.includes(d.diaId)).map(d => d.nombre).join(', ')}
        >
          {DIAS_SEMANA.map((dia) => (
            <MenuItem key={dia.diaId} value={dia.diaId}>
              <Checkbox checked={diasSeleccionados.indexOf(dia.diaId) > -1} />
              <ListItemText primary={dia.nombre} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Prioridad"
        name="prioridad"
        type="number"
        value={form.prioridad}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Fecha Inicio Vigencia"
        name="fechaIniVigencia"
        type="date"
        value={form.fechaIniVigencia}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <TextField
        label="Fecha Fin Vigencia"
        name="fechaFinVigencia"
        type="date"
        value={form.fechaFinVigencia}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <FormControlLabel
        control={<Switch checked={form.estado} onChange={e => setForm((prev: any) => ({ ...prev, estado: e.target.checked }))} />}
        label="¿Activa?"
      />
      <Button variant="contained" component="label">
        {form.file ? form.file.name : 'Subir PDF de Resolución'}
        <input type="file" accept="application/pdf" hidden onChange={handleChange} name="file" />
      </Button>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">Cancelar</Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>{rutaInicial ? 'Actualizar' : 'Guardar'}</Button>
      </DialogActions>
    </Box>
  );
};

export default RutaForm; 
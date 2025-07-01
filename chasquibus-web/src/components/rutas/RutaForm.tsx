import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Select, InputLabel, FormControl, Checkbox, ListItemText, FormControlLabel, Switch, DialogActions, Snackbar, Alert } from '@mui/material';
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

const TODOS_IDS = DIAS_SEMANA.map(d => d.diaId);

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
    esDirecto: false,
  });
  const [diasSeleccionados, setDiasSeleccionados] = useState<number[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

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
        esDirecto: rutaInicial.esDirecto ?? false,
      });
      setDiasSeleccionados(rutaInicial.diasOperacion.map((d: DiaOperacion) => d.diaId));
    } else {
      setForm({ paradaOrigenId: '', paradaDestinoId: '', prioridad: '', fechaIniVigencia: '', fechaFinVigencia: '', estado: true, diasOperacion: [], file: null, esDirecto: false });
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
    if (value.includes('todos')) {
      setDiasSeleccionados(TODOS_IDS);
    } else {
      setDiasSeleccionados(typeof value === 'string' ? value.split(',') : value);
    }
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
      esDirecto: Boolean(form.esDirecto),
      diasOperacion,
      file: form.file,
    };
    onSubmit(payload);
    setSuccessMsg(rutaInicial ? 'Ruta actualizada correctamente' : 'Ruta creada correctamente');
  };

  // Calcular la fecha mínima permitida (hoy)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
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
          {paradas.filter(p => p.esTerminal).map((p) => (
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
          {paradas.filter(p => p.esTerminal).map((p) => (
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
          renderValue={(selected) => {
            if (selected.length === TODOS_IDS.length) return 'Todos';
            return DIAS_SEMANA.filter(d => selected.includes(d.diaId)).map(d => d.nombre).join(', ');
          }}
        >
          <MenuItem value="todos">
            <Checkbox checked={diasSeleccionados.length === TODOS_IDS.length} />
            <ListItemText primary="Todos" />
          </MenuItem>
          {DIAS_SEMANA.map((dia) => (
            <MenuItem key={dia.diaId} value={dia.diaId}>
              <Checkbox checked={diasSeleccionados.indexOf(dia.diaId) > -1} />
              <ListItemText primary={dia.nombre} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel id="prioridad-label">Prioridades</InputLabel>
        <Select
          labelId="prioridad-label"
          name="prioridad"
          value={form.prioridad}
          onChange={handleChange}
          label="Prioridad"
          displayEmpty
        >
          <MenuItem value="" disabled>
            Selecciona prioridad
          </MenuItem>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Fecha Inicio Vigencia"
        name="fechaIniVigencia"
        type="date"
        value={form.fechaIniVigencia}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        inputProps={{ min: getMinDate() }}
      />
      <TextField
        label="Fecha Fin Vigencia"
        name="fechaFinVigencia"
        type="date"
        value={form.fechaFinVigencia}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        inputProps={{ min: getMinDate() }}
      />
      <FormControlLabel
        control={<Switch checked={form.estado} onChange={e => setForm((prev: any) => ({ ...prev, estado: e.target.checked }))} />}
        label="¿Activa?"
      />
      <FormControlLabel
        control={<Switch checked={form.esDirecto} onChange={e => setForm((prev: any) => ({ ...prev, esDirecto: e.target.checked }))} />}
        label="¿Es ruta directa?"
      />
      {form.esDirecto && (
        <Box sx={{ color: 'orange', fontWeight: 500, mb: 1 }}>
          Esta ruta es directa, no se podrán gestionar paradas intermedias.
        </Box>
      )}
      <Button variant="contained" component="label">
        {form.file ? form.file.name : 'Subir PDF de Resolución'}
        <input type="file" accept="application/pdf" hidden onChange={handleChange} name="file" />
      </Button>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">Cancelar</Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>{rutaInicial ? 'Actualizar' : 'Guardar'}</Button>
      </DialogActions>
      <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSuccessMsg('')} severity="success" sx={{ width: '100%' }}>
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RutaForm; 
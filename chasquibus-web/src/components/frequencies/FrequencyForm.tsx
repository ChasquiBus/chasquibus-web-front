import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import MuiAlert from '@mui/material/Alert';
import { Frequency } from '@/services/frequencies';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface FrequencyFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { rutaId: string; horaSalidaProg: string; horaLlegadaProg: string }) => void;
  rutas: { id: number; nombre: string }[];
  initialData?: Partial<Frequency>;
  loading?: boolean;
}

const FrequencyForm: React.FC<FrequencyFormProps> = ({ open, onClose, onSubmit, rutas, initialData, loading }) => {
  const [form, setForm] = useState({ rutaId: '', horaSalidaProg: '', horaLlegadaProg: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        rutaId: initialData.rutaId ? String(initialData.rutaId) : '',
        horaSalidaProg: initialData.horaSalidaProg || '',
        horaLlegadaProg: initialData.horaLlegadaProg || '',
      });
    } else {
      setForm({ rutaId: '', horaSalidaProg: '', horaLlegadaProg: '' });
    }
    setError('');
  }, [initialData, open]);

  const validate = () => {
    if (!form.rutaId || !form.horaSalidaProg || !form.horaLlegadaProg) {
      setError('Todos los campos son obligatorios.');
      return false;
    }
    if (form.horaSalidaProg >= form.horaLlegadaProg) {
      setError('La hora de llegada debe ser mayor a la de salida.');
      return false;
    }
    if (!/^\d{2}:\d{2}:\d{2}$/.test(form.horaSalidaProg) || !/^\d{2}:\d{2}:\d{2}$/.test(form.horaLlegadaProg)) {
      setError('El formato de hora debe ser HH:mm:ss.');
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (name: string, value: any) => {
    if (value && dayjs.isDayjs(value)) {
      setForm({ ...form, [name]: value.format('HH:mm:ss') });
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Editar Frecuencia' : 'Nueva Frecuencia'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
        <TextField
          select
          label="Ruta"
          name="rutaId"
          value={form.rutaId}
          onChange={handleChange}
          fullWidth
          disabled={!!initialData}
        >
          {rutas.map((ruta) => (
            <MenuItem key={ruta.id} value={ruta.id}>{ruta.nombre}</MenuItem>
          ))}
        </TextField>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Hora de Salida"
            value={form.horaSalidaProg ? dayjs(form.horaSalidaProg, 'HH:mm:ss') : null}
            onChange={value => handleTimeChange('horaSalidaProg', value)}
            ampm={false}
            format="HH:mm"
            slotProps={{ textField: { fullWidth: true } }}
          />
          <TimePicker
            label="Hora de Llegada"
            value={form.horaLlegadaProg ? dayjs(form.horaLlegadaProg, 'HH:mm:ss') : null}
            onChange={value => handleTimeChange('horaLlegadaProg', value)}
            ampm={false}
            format="HH:mm"
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
        {error && <MuiAlert severity="error">{error}</MuiAlert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FrequencyForm; 
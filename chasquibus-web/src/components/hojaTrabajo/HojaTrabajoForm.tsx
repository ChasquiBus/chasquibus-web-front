import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import MuiAlert from '@mui/material/Alert';
import { HojaTrabajo, EstadoHojaTrabajo } from '@/services/hojaTrabajo';

interface HojaTrabajoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  buses: { id: number; placa: string }[];
  choferes: { id: number; nombre: string }[];
  frecuencias: { id: number; horaSalidaProg: string; horaLlegadaProg: string; rutaId: number }[];
  rutas?: { id: number; nombre: string; origen?: string; destino?: string }[];
  initialData?: Partial<HojaTrabajo>;
  loading?: boolean;
  error?: string;
}

const HojaTrabajoForm: React.FC<HojaTrabajoFormProps> = ({ open, onClose, onSubmit, buses, choferes, frecuencias, rutas, initialData, loading, error }) => {
  const [form, setForm] = useState<any>({ busId: '', choferId: '', frecDiaId: '', observaciones: '', fechaSalida: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        busId: initialData.busId || '',
        choferId: initialData.choferId || '',
        frecDiaId: initialData.frecDiaId || '',
        observaciones: initialData.observaciones || '',
        fechaSalida: initialData.fechaSalida || '',
      });
    } else {
      setForm({ busId: '', choferId: '', frecDiaId: '', observaciones: '', fechaSalida: '' });
    }
    setFormError('');
  }, [initialData, open]);

  const validate = () => {
    if (!form.busId || !form.choferId || !form.frecDiaId) {
      setFormError('Todos los campos obligatorios deben estar completos.');
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      busId: Number(form.busId),
      choferId: Number(form.choferId),
      frecDiaId: Number(form.frecDiaId),
      fechaSalida: form.fechaSalida,
      observaciones: form.observaciones
    };
    onSubmit(payload);
  };

  // Obtener la fecha de hoy en formato yyyy-MM-dd
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Editar Hoja de Trabajo' : 'Nueva Hoja de Trabajo'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
        <TextField select label="Bus" name="busId" value={String(form.busId)} onChange={handleChange} fullWidth>
          <MenuItem value="">Selecciona un bus</MenuItem>
          {buses.map((bus) => (
            <MenuItem key={bus.id} value={String(bus.id)}>{bus.placa || 'SIN PLACA'}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Chofer" name="choferId" value={form.choferId} onChange={handleChange} fullWidth>
          {choferes.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Frecuencia" name="frecDiaId" value={form.frecDiaId} onChange={handleChange} fullWidth>
          {frecuencias.map((f) => {
            let origen = '';
            let destino = '';
            if (typeof rutas !== 'undefined') {
              const ruta = rutas.find(r => r.id === f.rutaId);
              if (ruta) {
                // Si la ruta tiene nombre, origen y destino
                if (ruta.origen && ruta.destino) {
                  origen = ruta.origen;
                  destino = ruta.destino;
                } else if (ruta.nombre) {
                  // Si solo tiene nombre
                  const partes = ruta.nombre.split(':');
                  if (partes.length > 1) {
                    const od = partes[1].split('→');
                    if (od.length === 2) {
                      origen = od[0].trim();
                      destino = od[1].trim();
                    }
                  }
                }
              }
            }
            return (
              <MenuItem key={f.id} value={f.id}>
                {`[${f.horaSalidaProg} - ${f.horaLlegadaProg}] Ruta ${f.rutaId}`}
                {origen && destino ? ` (${origen} → ${destino})` : ''}
              </MenuItem>
            );
          })}
        </TextField>
        <TextField label="Fecha de Salida" name="fechaSalida" type="date" value={form.fechaSalida} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} inputProps={{ min: minDate }} />
        <TextField label="Observaciones" name="observaciones" value={form.observaciones} onChange={handleChange} fullWidth multiline minRows={2} />
        {(error || formError) && <MuiAlert severity="error">{error || formError}</MuiAlert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HojaTrabajoForm; 
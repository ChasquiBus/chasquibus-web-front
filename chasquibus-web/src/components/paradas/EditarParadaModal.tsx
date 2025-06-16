import React, { useState, useEffect } from 'react';
import { Parada } from './ParadasTable';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Switch,
  FormControlLabel
} from '@mui/material';

interface EditarParadaModalProps {
  open: boolean;
  parada: Parada | null;
  onSave: (data: Partial<Parada>) => void;
  onClose: () => void;
}

const EditarParadaModal: React.FC<EditarParadaModalProps> = ({ open, parada, onSave, onClose }) => {
  const [ciudadId, setCiudadId] = useState('');
  const [nombreParada, setNombreParada] = useState('');
  const [direccion, setDireccion] = useState('');
  const [esTerminal, setEsTerminal] = useState(false);

  useEffect(() => {
    if (parada) {
      setCiudadId(parada.ciudadId ? String(parada.ciudadId) : '');
      setNombreParada(parada.nombreParada || '');
      setDireccion(parada.direccion || '');
      setEsTerminal(!!parada.esTerminal);
    }
  }, [parada]);

  const handleSave = () => {
    onSave({
      id: parada?.id,
      ciudadId: ciudadId ? Number(ciudadId) : undefined,
      nombreParada,
      direccion,
      esTerminal,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Editar Parada</DialogTitle>
      <DialogContent>
        <TextField
          label="ID de Ciudad"
          value={ciudadId}
          onChange={e => setCiudadId(e.target.value)}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Nombre de Parada"
          value={nombreParada}
          onChange={e => setNombreParada(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Dirección"
          value={direccion}
          onChange={e => setDireccion(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={<Switch checked={esTerminal} onChange={e => setEsTerminal(e.target.checked)} />}
          label="¿Es Terminal?"
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarParadaModal; 
import React, { useState, useEffect } from 'react';
import { Ciudad } from './CiudadesTable';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

interface EditarCiudadModalProps {
  open: boolean;
  ciudad: Ciudad | null;
  onSave: (data: Partial<Ciudad>) => void;
  onClose: () => void;
}

const EditarCiudadModal: React.FC<EditarCiudadModalProps> = ({ open, ciudad, onSave, onClose }) => {
  const [provincia, setProvincia] = useState('');
  const [ciudadNombre, setCiudadNombre] = useState('');

  useEffect(() => {
    if (ciudad) {
      setProvincia(ciudad.provincia);
      setCiudadNombre(ciudad.ciudad);
    }
  }, [ciudad]);

  const handleSave = () => {
    onSave({ id: ciudad?.id, provincia, ciudad: ciudadNombre });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Editar Ciudad</DialogTitle>
      <DialogContent>
        <TextField
          label="Provincia"
          value={provincia}
          onChange={e => setProvincia(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Ciudad"
          value={ciudadNombre}
          onChange={e => setCiudadNombre(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarCiudadModal; 
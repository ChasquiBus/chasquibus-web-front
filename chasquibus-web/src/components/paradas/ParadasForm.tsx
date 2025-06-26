import React, { useState } from 'react';
import { Box, TextField, Button, Alert, Switch, FormControlLabel } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

export interface CiudadOption {
  id: number;
  ciudad: string;
}

interface ParadasFormProps {
  onSubmit: (data: { nombreParada: string; ciudadId: number; direccion?: string; esTerminal: boolean }) => void;
  ciudades: CiudadOption[];
}

const ParadasForm: React.FC<ParadasFormProps> = ({ onSubmit, ciudades }) => {
  const [ciudadId, setCiudadId] = useState<number | null>(null);
  const [ciudadInput, setCiudadInput] = useState('');
  const [nombreParada, setNombreParada] = useState('');
  const [direccion, setDireccion] = useState('');
  const [esTerminal, setEsTerminal] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ciudadId || !nombreParada) {
      setError('Ciudad y nombre de parada son obligatorios');
      return;
    }
    setError('');
    const payload: any = { nombreParada, ciudadId, esTerminal };
    if (direccion) payload.direccion = direccion;
    onSubmit(payload);
    setCiudadId(null);
    setCiudadInput('');
    setNombreParada('');
    setDireccion('');
    setEsTerminal(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, maxWidth: 400 }}>
      <Autocomplete
        options={ciudades}
        getOptionLabel={(option) => option.ciudad}
        value={ciudades.find(c => c.id === ciudadId) || null}
        onChange={(_e, newValue) => setCiudadId(newValue ? newValue.id : null)}
        inputValue={ciudadInput}
        onInputChange={(_e, newInputValue) => setCiudadInput(newInputValue)}
        renderInput={(params) => (
          <TextField {...params} label="Ciudad" required margin="normal" fullWidth />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        noOptionsText={ciudades.length === 0 ? 'No hay ciudades disponibles' : 'No se encontró la ciudad'}
      />
      <TextField
        label="Nombre de Parada"
        value={nombreParada}
        onChange={e => setNombreParada(e.target.value)}
        required
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
        sx={{ mt: 1, color: '#111' }}
      />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Agregar Parada
      </Button>
    </Box>
  );
};

export default ParadasForm; 
"use client";
import React, { useState } from "react";
import { Box, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip, IconButton } from "@mui/material";
import { Bus } from '@/types/bus';
import { PosicionAsiento } from '@/services/configuracionAsientos';
import DeleteIcon from '@mui/icons-material/Delete';

interface AsientosGridProps {
  bus: Bus;
  posiciones: PosicionAsiento[];
  onChange: (posiciones: PosicionAsiento[]) => void;
}

const tipos = [
  { value: 'NORMAL', label: 'Normal', color: '#4caf50' },
  { value: 'VIP', label: 'VIP', color: '#FFD700' },
];

function getColor(tipo: string) {
  if (tipo === 'VIP') return '#FFD700';
  if (tipo === 'NORMAL') return '#4caf50';
  return '#bdbdbd';
}

export default function AsientosGrid({ bus, posiciones, onChange }: AsientosGridProps) {
  const [selected, setSelected] = useState<PosicionAsiento | null>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [editData, setEditData] = useState<Partial<PosicionAsiento>>({});
  const [piso, setPiso] = useState(1);
  const [addDialog, setAddDialog] = useState(false);
  const [addData, setAddData] = useState<Partial<PosicionAsiento>>({ fila: 1, columna: 1, piso: 1, tipoAsiento: 'NORMAL', precio: '' });

  // Determinar filas y columnas máximas
  const maxFila = Math.max(1, ...posiciones.map(p => p.fila));
  const maxCol = Math.max(1, ...posiciones.map(p => p.columna));

  // Filtrar asientos por piso
  const asientosPiso = posiciones.filter(p => p.piso === piso);

  const handleAsientoClick = (asiento: PosicionAsiento) => {
    setSelected(asiento);
    setEditData({ ...asiento });
    setEditDialog(true);
  };

  const handleEditSave = () => {
    if (!editData.fila || !editData.columna || !editData.piso || !editData.tipoAsiento || !editData.precio) return;
    const nuevas = posiciones.map(a =>
      a.fila === selected?.fila && a.columna === selected?.columna && a.piso === selected?.piso
        ? { ...editData } as PosicionAsiento
        : a
    );
    onChange(nuevas);
    setEditDialog(false);
    setSelected(null);
  };

  const handleAddAsiento = () => {
    if (!addData.fila || !addData.columna || !addData.piso || !addData.tipoAsiento || !addData.precio) return;
    // No permitir duplicados
    if (posiciones.some(a => a.fila === addData.fila && a.columna === addData.columna && a.piso === addData.piso)) return;
    onChange([...posiciones, addData as PosicionAsiento]);
    setAddDialog(false);
    setAddData({ fila: 1, columna: 1, piso: piso, tipoAsiento: 'NORMAL', precio: '' });
  };

  const handleDelete = (asiento: PosicionAsiento) => {
    onChange(posiciones.filter(a => !(a.fila === asiento.fila && a.columna === asiento.columna && a.piso === asiento.piso)));
  };

  return (
    <Box sx={{ mt: 4 }}>
      {bus.piso_doble && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant={piso === 1 ? "contained" : "outlined"}
            onClick={() => setPiso(1)}
            sx={{ mr: 1 }}
          >
            Piso 1
          </Button>
          <Button
            variant={piso === 2 ? "contained" : "outlined"}
            onClick={() => setPiso(2)}
          >
            Piso 2
          </Button>
        </Box>
      )}
      <Typography variant="h6" sx={{ mb: 2 }}>Asientos Piso {piso}</Typography>
      <Button variant="outlined" color="success" sx={{ mb: 2 }} onClick={() => setAddDialog(true)}>
        + Agregar Asiento
      </Button>
      <Box sx={{ width: 420, maxWidth: '100%', overflowX: 'auto', mx: 'auto', mt: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 1.5,
            justifyItems: 'center',
            alignItems: 'center',
            background: '#fff',
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          {[...Array(maxFila)].map((_, filaIdx) =>
            [...Array(5)].map((_, colIdx) => {
              const col = colIdx + 1;
              if (col === 3) {
                return <Box key={`f${filaIdx}c${colIdx}`} sx={{ width: 56, height: 56, background: 'transparent' }} />;
              }
              const asiento = asientosPiso.find(a => a.fila === filaIdx + 1 && a.columna === col);
              return asiento ? (
                <Box key={`f${filaIdx}c${colIdx}`} sx={{ position: 'relative', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    sx={{
                      width: 56,
                      height: 56,
                      background: getColor(asiento.tipoAsiento),
                      color: '#222',
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: 2,
                      boxShadow: 1,
                      p: 0,
                    }}
                    onClick={() => handleAsientoClick(asiento)}
                  >
                    {asiento.fila}-{asiento.columna}
                    <Chip
                      label={asiento.tipoAsiento}
                      size="small"
                      sx={{ ml: 1, background: 'rgba(0,0,0,0.1)' }}
                    />
                  </Button>
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: -10, right: -10, background: '#fff' }}
                    onClick={() => handleDelete(asiento)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Box key={`f${filaIdx}c${colIdx}`} sx={{ width: 56, height: 56, border: '2px solid #eee', borderRadius: 2, background: '#fafafa' }} />
              );
            })
          )}
        </Box>
      </Box>
      {/* Diálogo para editar asiento */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Editar Asiento</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Fila"
            type="number"
            value={editData.fila || ''}
            onChange={e => setEditData(d => ({ ...d, fila: Number(e.target.value) }))}
            disabled
          />
          <TextField
            label="Columna"
            type="number"
            value={editData.columna || ''}
            onChange={e => setEditData(d => ({ ...d, columna: Number(e.target.value) }))}
            disabled
          />
          <TextField
            label="Piso"
            type="number"
            value={editData.piso || ''}
            onChange={e => setEditData(d => ({ ...d, piso: Number(e.target.value) }))}
            disabled
          />
          <TextField
            select
            label="Tipo de Asiento"
            value={editData.tipoAsiento || ''}
            onChange={e => setEditData(d => ({ ...d, tipoAsiento: e.target.value as 'NORMAL' | 'VIP' }))}
            disabled={editData.piso === 1}
          >
            {tipos.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Precio"
            type="number"
            value={editData.precio || ''}
            onChange={e => setEditData(d => ({ ...d, precio: e.target.value }))}
            inputProps={{ step: '0.01', min: 0 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleEditSave} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
      {/* Diálogo para agregar asiento */}
      <Dialog open={addDialog} onClose={() => setAddDialog(false)}>
        <DialogTitle>Agregar Asiento</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Fila"
            type="number"
            value={addData.fila || ''}
            onChange={e => setAddData(d => ({ ...d, fila: Number(e.target.value) }))}
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Columna"
            type="number"
            value={addData.columna || ''}
            onChange={e => setAddData(d => ({ ...d, columna: Number(e.target.value) }))}
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Piso"
            type="number"
            value={addData.piso || piso}
            onChange={e => setAddData(d => ({ ...d, piso: Number(e.target.value) }))}
            inputProps={{ min: 1, max: bus.piso_doble ? 2 : 1 }}
            disabled={!bus.piso_doble}
          />
          <TextField
            select
            label="Tipo de Asiento"
            value={addData.tipoAsiento || 'NORMAL'}
            onChange={e => setAddData(d => ({ ...d, tipoAsiento: e.target.value as 'NORMAL' | 'VIP' }))}
            disabled={addData.piso === 1 || (!addData.piso && piso === 1)}
          >
            {tipos.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Precio"
            type="number"
            value={addData.precio || ''}
            onChange={e => setAddData(d => ({ ...d, precio: e.target.value }))}
            inputProps={{ step: '0.01', min: 0 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddAsiento} variant="contained">Agregar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 
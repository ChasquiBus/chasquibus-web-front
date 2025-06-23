"use client";
import React, { useState } from "react";
import { Box, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip, IconButton, Alert, Stack } from "@mui/material";
import { Bus } from '@/types/bus';
import { PosicionAsiento } from '@/services/configuracionAsientos';
import DeleteIcon from '@mui/icons-material/Delete';

interface AsientosGridProps {
  bus: Bus;
  posiciones: PosicionAsiento[];
  onChange: (posiciones: PosicionAsiento[]) => void;
  onAddRow: () => void;
  template: string;
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

// Función para validar las posiciones
const validarPosiciones = (posiciones: PosicionAsiento[], bus: Bus): { valido: boolean; mensaje?: string } => {
  // Validar número total de asientos
  const totalAsientos = posiciones.length;
  const maxAsientos = bus.piso_doble 
    ? (bus.total_asientos + (bus.total_asientos_piso2 || 0))
    : bus.total_asientos;

  if (totalAsientos > maxAsientos) {
    return {
      valido: false,
      mensaje: `El número total de asientos (${totalAsientos}) excede el máximo permitido (${maxAsientos})`
    };
  }

  // Validar asientos por piso
  const asientosPiso1 = posiciones.filter(p => p.piso === 1);
  const asientosPiso2 = posiciones.filter(p => p.piso === 2);

  if (asientosPiso1.length > bus.total_asientos) {
    return {
      valido: false,
      mensaje: `El número de asientos en el piso 1 (${asientosPiso1.length}) excede el máximo permitido (${bus.total_asientos})`
    };
  }

  if (bus.piso_doble && asientosPiso2.length > (bus.total_asientos_piso2 || 0)) {
    return {
      valido: false,
      mensaje: `El número de asientos en el piso 2 (${asientosPiso2.length}) excede el máximo permitido (${bus.total_asientos_piso2})`
    };
  }

  // Validar que en el piso 1 solo haya asientos NORMAL
  const asientosInvalidosPiso1 = asientosPiso1.filter(p => p.tipoAsiento !== 'NORMAL');
  if (asientosInvalidosPiso1.length > 0) {
    return {
      valido: false,
      mensaje: 'En el piso 1 solo se permiten asientos de tipo NORMAL'
    };
  }

  // Validar precios VIP > NORMAL
  const preciosVIP = asientosPiso2.filter(p => p.tipoAsiento === 'VIP').map(p => parseFloat(p.precio));
  const preciosNORMAL = asientosPiso2.filter(p => p.tipoAsiento === 'NORMAL').map(p => parseFloat(p.precio));

  if (preciosVIP.length > 0 && preciosNORMAL.length > 0) {
    const minPrecioVIP = Math.min(...preciosVIP);
    const maxPrecioNORMAL = Math.max(...preciosNORMAL);

    if (minPrecioVIP <= maxPrecioNORMAL) {
      return {
        valido: false,
        mensaje: 'Los precios de los asientos VIP deben ser mayores que los asientos NORMAL'
      };
    }
  }

  return { valido: true };
};

export default function AsientosGrid({ bus, posiciones, onChange, onAddRow, template }: AsientosGridProps) {
  const [selected, setSelected] = useState<PosicionAsiento | null>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [editData, setEditData] = useState<Partial<PosicionAsiento>>({});
  const [piso, setPiso] = useState(1);
  const [addDialog, setAddDialog] = useState(false);
  const [addData, setAddData] = useState<Partial<PosicionAsiento>>({ fila: 1, columna: 1, piso: 1, tipoAsiento: 'NORMAL', precio: '0.00', numeroAsiento: 1 });
  const [error, setError] = useState<string | null>(null);
  // Selección múltiple
  const [multiSelect, setMultiSelect] = useState<PosicionAsiento[]>([]);
  const [massEditDialog, setMassEditDialog] = useState(false);
  const [massEditData, setMassEditData] = useState<{precio: string, tipoAsiento: 'NORMAL'|'VIP'}>({precio: '', tipoAsiento: 'NORMAL'});

  // Filtrar asientos por piso
  const asientosPiso = posiciones.filter(p => p.piso === piso);

  // Determinar filas y columnas máximas del piso actual
  const maxFila = Math.max(1, ...asientosPiso.map(p => p.fila));
  const maxCol = 5; // Siempre 5 columnas para la visualización del grid (con pasillo)

  const handleAsientoClick = (asiento: PosicionAsiento) => {
    setSelected(asiento);
    setEditData({ ...asiento });
    setEditDialog(true);
  };

  const handleEditSave = () => {
    if (!editData.fila || !editData.columna || !editData.piso || !editData.tipoAsiento || !editData.precio) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validar precio con 2 decimales
    const precio = parseFloat(editData.precio);
    if (isNaN(precio) || precio < 0 || !/^\d+(\.\d{1,2})?$/.test(editData.precio)) {
      setError('El precio debe ser un número positivo con máximo 2 decimales');
      return;
    }

    const nuevas = posiciones.map(a =>
      a.fila === selected?.fila && a.columna === selected?.columna && a.piso === selected?.piso
        ? { ...editData } as PosicionAsiento
        : a
    );

    const validacion = validarPosiciones(nuevas, bus);
    if (!validacion.valido) {
      setError(validacion.mensaje || 'Error de validación');
      return;
    }

    onChange(nuevas);
    setEditDialog(false);
    setSelected(null);
    setError(null);
  };

  const handleAddAsiento = () => {
    if (!addData.fila || !addData.columna || !addData.piso || !addData.tipoAsiento || !addData.precio || !addData.numeroAsiento) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validar precio con 2 decimales
    const precio = parseFloat(addData.precio);
    if (isNaN(precio) || precio < 0 || !/^\d+(\.\d{1,2})?$/.test(addData.precio)) {
      setError('El precio debe ser un número positivo con máximo 2 decimales');
      return;
    }

    // No permitir duplicados de posición o número de asiento
    if (posiciones.some(a => a.fila === addData.fila && a.columna === addData.columna && a.piso === addData.piso)) {
      setError('Ya existe un asiento en esta posición');
      return;
    }

    if (posiciones.some(a => a.numeroAsiento === addData.numeroAsiento)) {
      setError('El número de asiento ya existe');
      return;
    }

    onChange([...posiciones, addData as PosicionAsiento]);
    setAddDialog(false);
    setAddData({ fila: 1, columna: 1, piso: piso, tipoAsiento: 'NORMAL', precio: '0.00', numeroAsiento: 1 });
    setError(null);
  };

  const handleDelete = (asiento: PosicionAsiento) => {
    // Filtrar para eliminar el asiento seleccionado
    let nuevas = posiciones.filter(a => !(a.fila === asiento.fila && a.columna === asiento.columna && a.piso === asiento.piso));

    // Comprobar si la fila del asiento eliminado (en el mismo piso) ha quedado vacía
    const isRowEmpty = !nuevas.some(p => p.piso === asiento.piso && p.fila === asiento.fila);

    if (isRowEmpty) {
      // Si la fila está vacía, decrementar el número de fila de todas las filas posteriores en el mismo piso
      nuevas = nuevas.map(p => {
        if (p.piso === asiento.piso && p.fila > asiento.fila) {
          return { ...p, fila: p.fila - 1 };
        }
        return p;
      });
    }

    onChange(nuevas);
  };

  // Selección múltiple
  const toggleSelect = (asiento: PosicionAsiento) => {
    const key = (a: PosicionAsiento) => `${a.fila}-${a.columna}-${a.piso}`;
    if (multiSelect.some(a => key(a) === key(asiento))) {
      setMultiSelect(multiSelect.filter(a => key(a) !== key(asiento)));
    } else {
      setMultiSelect([...multiSelect, asiento]);
    }
  };

  const handleMassEdit = () => {
    if (!massEditData.precio || isNaN(Number(massEditData.precio)) || Number(massEditData.precio) < 0) {
      setError('El precio debe ser un número positivo');
      return;
    }
    // Solo permitir cambiar tipoAsiento en piso 2
    const nuevas = posiciones.map(a => {
      if (multiSelect.some(sel => sel.fila === a.fila && sel.columna === a.columna && sel.piso === a.piso)) {
        return {
          ...a,
          precio: massEditData.precio,
          tipoAsiento: (a.piso === 2 ? massEditData.tipoAsiento : 'NORMAL')
        };
      }
      return a;
    });
    onChange(nuevas);
    setMassEditDialog(false);
    setMultiSelect([]);
    setError(null);
  };

  return (
    <Box sx={{ mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {/* Panel de edición masiva */}
      {multiSelect.length > 0 && (
        <Box sx={{ mb: 2, p: 2, border: '2px solid #1976d2', borderRadius: 2, background: '#f5faff', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {multiSelect.length} asientos seleccionados
          </Typography>
          <Button variant="contained" color="primary" onClick={() => { setMassEditDialog(true); setMassEditData({precio: '', tipoAsiento: 'NORMAL'}); }}>
            Editar seleccionados
          </Button>
          <Button variant="outlined" color="error" onClick={() => setMultiSelect([])}>
            Limpiar selección
          </Button>
        </Box>
      )}
      {bus.piso_doble && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant={piso === 1 ? "contained" : "outlined"}
            onClick={() => setPiso(1)}
            sx={{
              mr: 1,
              color: piso === 1 ? '#000' : undefined,
              background: piso === 1 ? (theme) => theme.palette.primary.main : undefined,
            }}
          >
            Piso 1
          </Button>
          <Button
            variant={piso === 2 ? "contained" : "outlined"}
            onClick={() => setPiso(2)}
            sx={{
              color: piso === 2 ? '#000' : undefined,
              background: piso === 2 ? (theme) => theme.palette.primary.main : undefined,
            }}
          >
            Piso 2
          </Button>
        </Box>
      )}
      <Typography variant="h6" sx={{ mb: 2, color: '#000' }}>Asientos Piso {piso}</Typography>
      <Button
        variant="outlined"
        color="success"
        sx={{ mb: 2 }}
        onClick={onAddRow}
        disabled={template !== 'plantilla1' && template !== 'plantilla2' && template !== 'plantilla3'}
      >
        + Agregar Fila
      </Button>
      <Box sx={{ width: 'auto', maxWidth: '100%', overflowX: 'auto', mx: 'auto', mt: 2, display: 'inline-block' }}>
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
          {[...Array(maxFila)].map((_, filaIdx) => {
            const fila = filaIdx + 1;
            const isLastRowOfTemplate1 = template === 'plantilla1' && piso === 1 && fila === maxFila;
            const isFirstRowOfTemplate3 = template === 'plantilla3' && piso === 1 && fila === 1;
            const isLastRowWith5Seats = fila === maxFila && asientosPiso.filter(a => a.fila === fila).length >= 5;
            
            // Si es la última fila y tiene 5 asientos, o es la plantilla 1, no hay pasillo.
            const columnas = (isLastRowWith5Seats || isLastRowOfTemplate1) ? [1, 2, 3, 4, 5] : [1, 2, 0, 4, 5]; // 0 representa el pasillo

            return columnas.map((col, colIdx) => {
              if (col === 0) {
                return <Box key={`f${fila}c-pasillo`} sx={{ width: 56, height: 56, background: 'transparent' }} />;
              }
              const asiento = asientosPiso.find(a => a.fila === fila && a.columna === col);
              const isSelected = asiento && multiSelect.some(sel => sel.fila === asiento.fila && sel.columna === asiento.columna && sel.piso === asiento.piso);

              if (isLastRowOfTemplate1 && (col === 4 || col === 5)) {
                return <Box key={`f${fila}c${col}`} sx={{ width: 56, height: 56, background: '#eeeeee', borderRadius: 2, border: '2px dashed #ccc' }} />;
              }

              if (isFirstRowOfTemplate3 && (col === 2 || col === 4)) {
                return <Box key={`f${fila}c${col}`} sx={{ width: 56, height: 56, background: '#eeeeee', borderRadius: 2, border: '2px dashed #ccc' }} />;
              }

              return asiento ? (
                <Box key={`f${fila}c${col}`} sx={{ position: 'relative', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    sx={{
                      width: 56,
                      height: 56,
                      background: isSelected ? '#1976d2' : getColor(asiento.tipoAsiento),
                      color: isSelected ? '#fff' : '#222',
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: 2,
                      boxShadow: 1,
                      p: 0,
                      border: isSelected ? '2px solid #1976d2' : undefined,
                    }}
                    onClick={e => {
                      if (multiSelect.length > 0 || e.ctrlKey || e.metaKey) {
                        toggleSelect(asiento);
                      } else {
                        handleAsientoClick(asiento);
                      }
                    }}
                    onDoubleClick={() => handleAsientoClick(asiento)}
                  >
                    {asiento.numeroAsiento}
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
                <Box
                  key={`f${fila}c${col}`}
                  onClick={() => {
                    const maxAsiento = posiciones.length > 0 ? Math.max(...posiciones.map(p => p.numeroAsiento)) : 0;
                    setAddData({
                      fila: fila,
                      columna: col,
                      piso: piso,
                      tipoAsiento: 'NORMAL',
                      precio: '0.00',
                      numeroAsiento: maxAsiento + 1
                    });
                    setAddDialog(true);
                  }}
                  sx={{
                    width: 56,
                    height: 56,
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    background: '#fafafa',
                    cursor: 'pointer',
                    '&:hover': {
                      background: '#e9e9e9',
                      borderColor: '#aaa'
                    }
                  }}
                />
              );
            });
          })}
        </Box>
      </Box>
      {/* Diálogo para editar asiento */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Editar Asiento</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Número de Asiento"
            type="number"
            value={editData.numeroAsiento || ''}
            disabled
          />
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
            label="Número de Asiento"
            type="number"
            value={addData.numeroAsiento || ''}
            onChange={e => setAddData(d => ({ ...d, numeroAsiento: Number(e.target.value) }))}
            inputProps={{ min: 1 }}
          />
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
      {/* Modal de edición masiva */}
      <Dialog open={massEditDialog} onClose={() => setMassEditDialog(false)}>
        <DialogTitle>Editar asientos seleccionados</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Precio"
            type="number"
            value={massEditData.precio}
            onChange={e => setMassEditData(d => ({ ...d, precio: e.target.value }))}
            inputProps={{ step: '0.01', min: 0 }}
          />
          {piso === 2 && (
            <TextField
              select
              label="Tipo de Asiento"
              value={massEditData.tipoAsiento}
              onChange={e => setMassEditData(d => ({ ...d, tipoAsiento: e.target.value as 'NORMAL' | 'VIP' }))}
            >
              {tipos.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMassEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleMassEdit} variant="contained">Aplicar a seleccionados</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 
import React from 'react';
import { Box, Typography } from '@mui/material';
import { PosicionAsiento } from '@/services/configuracionAsientos';

interface SeleccionAsientosGridProps {
  posiciones: PosicionAsiento[];
  asientosSeleccionados: PosicionAsiento[];
  setAsientosSeleccionados: (asientos: PosicionAsiento[]) => void;
  pisosDisponibles?: number[]; // [1] o [1,2]
}

const SeleccionAsientosGrid: React.FC<SeleccionAsientosGridProps> = ({ posiciones, asientosSeleccionados, setAsientosSeleccionados, pisosDisponibles = [1] }) => {
  // Handler de selección
  const handleSelect = (asiento: PosicionAsiento) => {
    const key = (a: PosicionAsiento) => `${a.fila}-${a.columna}-${a.piso}`;
    if (asientosSeleccionados.some(a => key(a) === key(asiento))) {
      setAsientosSeleccionados(asientosSeleccionados.filter(a => key(a) !== key(asiento)));
    } else {
      setAsientosSeleccionados([...asientosSeleccionados, { ...asiento, ocupado: true }]);
    }
  };

  // Saber si un asiento está seleccionado
  const isSelected = (asiento: PosicionAsiento) => {
    const key = (a: PosicionAsiento) => `${a.fila}-${a.columna}-${a.piso}`;
    return asientosSeleccionados.some(a => key(a) === key(asiento));
  };

  // Renderiza el grid de un piso
  const renderGrid = (piso: number) => {
    const asientosPiso = posiciones.filter(p => p.piso === piso);
    if (asientosPiso.length === 0) return null;
    const maxFila = Math.max(...asientosPiso.map(p => p.fila));
    const maxCol = Math.max(...asientosPiso.map(p => p.columna));
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 2 }}>
        <Typography variant="h6" sx={{ mb: 1, textAlign: 'center', fontWeight: 700 }}>{`PISO ${piso}`}</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${maxCol}, 22px)`, gap: '0px', justifyContent: 'center' }}>
          {[...Array(maxFila)].map((_, filaIdx) => (
            [...Array(maxCol)].map((_, colIdx) => {
              const fila = filaIdx + 1;
              const col = colIdx + 1;
              const asiento = asientosPiso.find(a => a.fila === fila && a.columna === col);
              if (!asiento) {
                return <Box key={`f${fila}c${col}-empty`} sx={{ width: 22, height: 22, background: 'transparent', m: 0, p: 0 }} />;
              }
              return (
                <Box
                  key={`f${fila}c${col}p${asiento.piso}n${asiento.numeroAsiento}`}
                  sx={{
                    width: 22,
                    height: 22,
                    background: isSelected(asiento) ? '#1976d2' : (asiento.tipoAsiento === 'VIP' ? '#FFD700' : '#4caf50'),
                    color: isSelected(asiento) ? '#fff' : '#222',
                    fontWeight: 700,
                    fontSize: 11,
                    borderRadius: 1,
                    boxShadow: 1,
                    p: 0,
                    border: isSelected(asiento) ? '2px solid #1976d2' : undefined,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: asiento.ocupado && !isSelected(asiento) ? 'not-allowed' : 'pointer',
                    opacity: asiento.ocupado && !isSelected(asiento) ? 0.4 : 1,
                    userSelect: 'none',
                    m: 0
                  }}
                  onClick={() => {
                    if (!asiento.ocupado || isSelected(asiento)) handleSelect(asiento);
                  }}
                >
                  {asiento.numeroAsiento}
                </Box>
              );
            })
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
      {pisosDisponibles.map(piso => renderGrid(piso))}
      <Box sx={{ width: '100%' }}>
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>Asientos seleccionados: {asientosSeleccionados.map(a => a.numeroAsiento).join(', ')}</Typography>
      </Box>
    </Box>
  );
};

export default SeleccionAsientosGrid; 
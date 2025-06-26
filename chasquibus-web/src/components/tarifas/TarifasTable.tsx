import React from 'react';
import { TarifaParada } from '@/services/tarifasParadas';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Box, Chip, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ParadaRef {
  id: number;
  nombreParada: string;
}

interface TarifasTableProps {
  tarifas: TarifaParada[];
  paradas: ParadaRef[];
  onEdit: (tarifa: TarifaParada) => void;
  onDelete: (id: number) => void;
}

const TarifasTable: React.FC<TarifasTableProps> = ({ tarifas, paradas, onEdit, onDelete }) => {
  const getNombreParada = (id: number) => paradas.find(p => p.id === id)?.nombreParada || id;

  return (
    <TableContainer component={Paper} sx={{ mt: 4, boxShadow: 3, borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla tarifas">
        <TableHead>
          <TableRow>
            <TableCell><b>ID</b></TableCell>
            <TableCell><b>Ruta</b></TableCell>
            <TableCell><b>Origen</b></TableCell>
            <TableCell><b>Destino</b></TableCell>
            <TableCell><b>Tipo de Asiento</b></TableCell>
            <TableCell><b>Valor</b></TableCell>
            <TableCell><b>¿Activa?</b></TableCell>
            <TableCell><b>Acciones</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tarifas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="subtitle1" color="textSecondary" sx={{ py: 3 }}>
                  No hay tarifas registradas.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            tarifas.map((tarifa) => (
              <TableRow key={tarifa.id}>
                <TableCell>{tarifa.id}</TableCell>
                <TableCell>{tarifa.rutaId}</TableCell>
                <TableCell>{getNombreParada(Number(tarifa.paradaOrigenId))}</TableCell>
                <TableCell>{getNombreParada(Number(tarifa.paradaDestinoId))}</TableCell>
                <TableCell>{tarifa.tipoAsiento || '-'}</TableCell>
                <TableCell>{!isNaN(Number(tarifa.valor)) ? Number(tarifa.valor).toFixed(2) : '-'}</TableCell>
                <TableCell>
                  <Chip label={tarifa.aplicaTarifa ? 'Sí' : 'No'} color={tarifa.aplicaTarifa ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Editar">
                      <IconButton color="primary" onClick={() => onEdit(tarifa)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton color="error" onClick={() => onDelete(tarifa.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TarifasTable; 
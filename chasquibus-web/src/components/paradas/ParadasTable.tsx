import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export interface Parada {
  id: number;
  nombreParada: string;
  ciudadId: number;
  direccion?: string;
  esTerminal: boolean;
  ciudad?: { ciudad: string } | null;
}

interface ParadasTableProps {
  paradas: Parada[];
  onEdit: (parada: Parada) => void;
  onDelete: (parada: Parada) => void;
}

const ParadasTable: React.FC<ParadasTableProps> = ({ paradas, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 4, boxShadow: 3, borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla paradas">
        <TableHead>
          <TableRow>
            <TableCell><b>ID</b></TableCell>
            <TableCell><b>Ciudad</b></TableCell>
            <TableCell><b>Nombre de Parada</b></TableCell>
            <TableCell><b>Dirección</b></TableCell>
            <TableCell><b>¿Es Terminal?</b></TableCell>
            <TableCell><b>Acciones</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paradas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="subtitle1" color="textSecondary" sx={{ py: 3 }}>
                  No hay paradas registradas.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            paradas.map((parada) => (
              <TableRow key={parada.id}>
                <TableCell sx={{ color: '#000' }}>{parada.id}</TableCell>
                <TableCell sx={{ color: '#000' }}>{parada.ciudad?.ciudad || ''}</TableCell>
                <TableCell sx={{ color: '#000' }}>{parada.nombreParada}</TableCell>
                <TableCell sx={{ color: '#000' }}>{parada.direccion}</TableCell>
                <TableCell sx={{ color: '#000' }}>{parada.esTerminal ? 'Sí' : 'No'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton color="primary" onClick={() => onEdit(parada)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(parada)}>
                      <DeleteIcon />
                    </IconButton>
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

export default ParadasTable; 
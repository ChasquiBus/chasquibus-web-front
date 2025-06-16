import React from 'react';
import { Oficinista } from '@/types/oficinista';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface OficinistasTableProps {
  oficinistas: Oficinista[];
  onEdit: (oficinista: Oficinista) => void;
  onDelete: (id: number) => void;
}

const OficinistasTable: React.FC<OficinistasTableProps> = ({ oficinistas, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 4, boxShadow: 3, borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla oficinistas">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Cédula</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Activo</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {oficinistas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="subtitle1" color="textSecondary" sx={{ py: 3 }}>
                  No hay oficinistas registrados.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            oficinistas.map((oficinista) => (
              <TableRow key={oficinista.id}>
                <TableCell sx={{ color: '#000' }}>{oficinista.usuario?.nombre || '-'}</TableCell>
                <TableCell sx={{ color: '#000' }}>{oficinista.usuario?.apellido || '-'}</TableCell>
                <TableCell sx={{ color: '#000' }}>{oficinista.usuario?.cedula || '-'}</TableCell>
                <TableCell sx={{ color: '#000' }}>{oficinista.usuario?.telefono || '-'}</TableCell>
                <TableCell sx={{ color: '#000' }}>{oficinista.usuario?.email || '-'}</TableCell>
                <TableCell sx={{ color: '#000' }}>{oficinista.usuario?.activo ? 'Sí' : 'No'}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton color="primary" onClick={() => onEdit(oficinista)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(oficinista.id)}>
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

export default OficinistasTable; 
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
  Tooltip,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Cooperativa } from '@/types/cooperatives';

interface CooperativasTableProps {
  cooperativas: Cooperativa[];
  onEdit: (cooperativa: Cooperativa) => void;
  onDelete: (id: number) => void;
}

export default function CooperativasTable({
  cooperativas,
  onEdit,
  onDelete,
}: CooperativasTableProps) {
  const activas = cooperativas.filter((c) => c.activo !== false);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>RUC</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activas.map((cooperativa) => (
            <TableRow key={cooperativa.id}>
              <TableCell>{cooperativa.nombre}</TableCell>
              <TableCell>{cooperativa.ruc}</TableCell>
              <TableCell>{cooperativa.email}</TableCell>
              <TableCell>{cooperativa.telefono}</TableCell>
              <TableCell>{cooperativa.direccion}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(cooperativa)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(cooperativa.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 
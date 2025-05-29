import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Tooltip, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdminCooperativa } from '@/types/adminCooperativa';

interface Props {
  admins: AdminCooperativa[];
  onEdit: (admin: AdminCooperativa) => void;
  onDelete: (id: number) => void;
}

export default function AdminCooperativasTable({ admins, onEdit, onDelete }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cooperativa</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Cédula</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Activo</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.usuario.id}>
              <TableCell>{admin.cooperativaTransporteId}</TableCell>
              <TableCell>{admin.usuario.email}</TableCell>
              <TableCell>{admin.usuario.nombre}</TableCell>
              <TableCell>{admin.usuario.apellido}</TableCell>
              <TableCell>{admin.usuario.cedula}</TableCell>
              <TableCell>{admin.usuario.telefono}</TableCell>
              <TableCell>{admin.usuario.activo ? 'Sí' : 'No'}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => onEdit(admin)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" onClick={() => onDelete(admin.usuario.id)} color="error">
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
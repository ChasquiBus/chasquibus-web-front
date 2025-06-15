import React from 'react';
import { Chofer } from '@/types/chofer';
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
import VisibilityIcon from '@mui/icons-material/Visibility';

interface ChoferesTableProps {
  choferes: Chofer[];
  onEdit: (chofer: Chofer) => void;
  onView: (chofer: Chofer) => void;
  onDelete: (id: number) => void;
}

const ChoferesTable: React.FC<ChoferesTableProps> = ({ choferes, onEdit, onView, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 4, boxShadow: 3, borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Nombre Completo</TableCell>
            <TableCell>Cédula</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Licencia</TableCell>
            <TableCell>Tipo Sangre</TableCell>
            <TableCell>Activo</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {choferes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="subtitle1" color="textSecondary" sx={{ py: 3 }}>
                  No hay choferes disponibles.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            choferes.map((chofer) => (
              <TableRow
                key={chofer.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {chofer.usuario.email}
                </TableCell>
                <TableCell>{chofer.usuario.nombre} {chofer.usuario.apellido}</TableCell>
                <TableCell>{chofer.usuario.cedula}</TableCell>
                <TableCell>{chofer.usuario.telefono || 'N/A'}</TableCell>
                <TableCell>{chofer.numeroLicencia} ({chofer.tipoLicencia})</TableCell>
                <TableCell>{chofer.tipoSangre || 'N/A'}</TableCell>
                <TableCell>{chofer.usuario.activo ? 'Sí' : 'No'}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton color="info" onClick={() => onView(chofer)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => onEdit(chofer)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(chofer.id)}>
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

export default ChoferesTable; 
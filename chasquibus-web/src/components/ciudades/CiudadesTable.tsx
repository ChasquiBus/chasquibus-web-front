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

export interface Ciudad {
  id: number;
  provincia: string;
  ciudad: string;
}

interface CiudadesTableProps {
  ciudades: Ciudad[];
  onEdit: (ciudad: Ciudad) => void;
  onDelete: (ciudad: Ciudad) => void;
}

const CiudadesTable: React.FC<CiudadesTableProps> = ({ ciudades, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 4, boxShadow: 3, borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla ciudades">
        <TableHead>
          <TableRow>
            <TableCell><b>ID</b></TableCell>
            <TableCell><b>Provincia</b></TableCell>
            <TableCell><b>Ciudad</b></TableCell>
            <TableCell><b>Acciones</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ciudades.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography variant="subtitle1" color="textSecondary" sx={{ py: 3 }}>
                  No hay ciudades registradas.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            ciudades.map((ciudad) => (
              <TableRow key={ciudad.id}>
                <TableCell sx={{ color: '#000' }}>{ciudad.id}</TableCell>
                <TableCell sx={{ color: '#000' }}>{ciudad.provincia}</TableCell>
                <TableCell sx={{ color: '#000' }}>{ciudad.ciudad}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton color="primary" onClick={() => onEdit(ciudad)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(ciudad)}>
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

export default CiudadesTable; 
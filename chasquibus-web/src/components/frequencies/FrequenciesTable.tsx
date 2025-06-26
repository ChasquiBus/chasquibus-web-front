import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Frequency } from '@/services/frequencies';

interface FrequenciesTableProps {
  frequencies: Frequency[];
  rutas: { id: number; nombre: string }[];
  onEdit: (row: Frequency) => void;
  onDelete: (id: number) => void;
}

const FrequenciesTable: React.FC<FrequenciesTableProps> = ({ frequencies, rutas, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ruta</TableCell>
            <TableCell>Hora Salida</TableCell>
            <TableCell>Hora Llegada</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {frequencies.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{rutas.find((r) => r.id === row.rutaId)?.nombre || row.rutaId}</TableCell>
              <TableCell>{row.horaSalidaProg}</TableCell>
              <TableCell>{row.horaLlegadaProg}</TableCell>
              <TableCell>{row.activo ? 'Activa' : 'Inactiva'}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(row)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => onDelete(row.id)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FrequenciesTable; 
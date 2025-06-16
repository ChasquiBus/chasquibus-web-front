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
  Box,
  Link
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export interface Resolucion {
  id: number;
  nombre: string;
  descripcion?: string;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: boolean;
  enUso: boolean;
  documentoURL?: string;
}

interface ResolucionesTableProps {
  resoluciones: Resolucion[];
  onEdit: (resolucion: Resolucion) => void;
  onDelete: (resolucion: Resolucion) => void;
}

const ResolucionesTable: React.FC<ResolucionesTableProps> = ({ resoluciones, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 4, boxShadow: 3, borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla resoluciones">
        <TableHead>
          <TableRow>
            <TableCell><b>ID</b></TableCell>
            <TableCell><b>Nombre</b></TableCell>
            <TableCell><b>Descripción</b></TableCell>
            <TableCell><b>Fecha Emisión</b></TableCell>
            <TableCell><b>Fecha Vencimiento</b></TableCell>
            <TableCell><b>Estado</b></TableCell>
            <TableCell><b>En Uso</b></TableCell>
            <TableCell><b>Documento</b></TableCell>
            <TableCell><b>Acciones</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resoluciones.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <Typography variant="subtitle1" color="textSecondary" sx={{ py: 3 }}>
                  No hay resoluciones registradas.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            resoluciones.map((resolucion) => (
              <TableRow key={resolucion.id}>
                <TableCell sx={{ color: '#000' }}>{resolucion.id}</TableCell>
                <TableCell sx={{ color: '#000' }}>{resolucion.nombre}</TableCell>
                <TableCell sx={{ color: '#000' }}>{resolucion.descripcion || '-'}</TableCell>
                <TableCell sx={{ color: '#000' }}>{resolucion.fechaEmision}</TableCell>
                <TableCell sx={{ color: '#000' }}>{resolucion.fechaVencimiento}</TableCell>
                <TableCell sx={{ color: '#000' }}>{resolucion.estado ? 'Activa' : 'Inactiva'}</TableCell>
                <TableCell sx={{ color: '#000' }}>{resolucion.enUso ? 'Sí' : 'No'}</TableCell>
                <TableCell>
                  {resolucion.documentoURL ? (
                    <Link href={resolucion.documentoURL} target="_blank" rel="noopener noreferrer">
                      Ver PDF
                    </Link>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton color="primary" onClick={() => onEdit(resolucion)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(resolucion)}>
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

export default ResolucionesTable; 
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import Chip from '@mui/material/Chip';
import { HojaTrabajo, EstadoHojaTrabajo } from '@/services/hojaTrabajo';
import MuiAlert from '@mui/material/Alert';

interface HojaTrabajoTableProps {
  hojas: HojaTrabajo[];
  buses: { id: number; placa: string; imagen?: string }[];
  choferes: { id: number; nombre: string }[];
  rutas: { id: number; nombre: string }[];
  frecuencias: { id: number; horaSalidaProg: string; horaLlegadaProg: string; rutaId: number }[];
  onEdit: (row: HojaTrabajo) => void;
  onDelete: (id: number) => void;
  onView: (row: HojaTrabajo) => void;
  error?: string;
}

const estadoColor: Record<EstadoHojaTrabajo, 'success' | 'info' | 'default' | 'error' | 'warning'> = {
  programado: 'success',
  'en curso': 'info',
  completado: 'default',
  suspendido: 'warning',
  cancelado: 'error',
};

const HojaTrabajoTable: React.FC<HojaTrabajoTableProps> = ({ hojas, buses, choferes, rutas, frecuencias, onEdit, onDelete, onView, error }) => {
  return (
    <>
      {error && <MuiAlert severity="error">{error}</MuiAlert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bus</TableCell>
              <TableCell>Chofer</TableCell>
              <TableCell>Ruta</TableCell>
              <TableCell>Fecha Salida</TableCell>
              <TableCell>Hora Salida</TableCell>
              <TableCell>Hora Llegada</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hojas.map((row) => {
              const bus = buses.find((b) => b.id === row.busId);
              const chofer = choferes.find((c) => c.id === row.choferId);
              const frecuencia = frecuencias.find((f) => f.id === row.frecDiaId);
              const ruta = rutas.find((r) => r.id === (frecuencia?.rutaId || 0));
              return (
                <TableRow key={row.id}>
                  <TableCell>{bus ? `${bus.placa}` : row.busId}</TableCell>
                  <TableCell>{chofer ? chofer.nombre : row.choferId}</TableCell>
                  <TableCell>{ruta ? ruta.nombre : frecuencia?.rutaId}</TableCell>
                  <TableCell>{row.fechaSalida || '-'}</TableCell>
                  <TableCell>{frecuencia?.horaSalidaProg || '-'}</TableCell>
                  <TableCell>{frecuencia?.horaLlegadaProg || '-'}</TableCell>
                  <TableCell>
                    <Chip label={row.estado} color={estadoColor[row.estado]} size="small" />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => onView(row)}><VisibilityIcon /></IconButton>
                    <IconButton onClick={() => onEdit(row)} disabled={row.estado !== 'programado'}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => onDelete(row.id)} disabled={!(row.estado === 'programado' || row.estado === 'suspendido' || row.estado === 'cancelado')}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default HojaTrabajoTable; 
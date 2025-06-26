import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface DiaOperacion {
  diaId: number;
  tipo: 'operacion' | 'parada';
}

export interface Ruta {
  id: number;
  paradaOrigenId: number;
  paradaDestinoId: number;
  prioridad?: number;
  fechaIniVigencia?: string;
  fechaFinVigencia?: string;
  estado?: boolean;
  diasOperacion: DiaOperacion[];
  resolucionUrl?: string;
}

export interface CreateRutaDto {
  paradaOrigenId: number;
  paradaDestinoId: number;
  prioridad?: number;
  fechaIniVigencia?: string;
  fechaFinVigencia?: string;
  estado?: boolean;
  diasOperacion: DiaOperacion[];
  file: File;
}

export interface UpdateRutaDto {
  paradaOrigenId?: number;
  paradaDestinoId?: number;
  prioridad?: number;
  fechaIniVigencia?: string;
  fechaFinVigencia?: string;
  estado?: boolean;
  diasOperacion?: DiaOperacion[];
  file?: File;
}

function getToken() {
  return localStorage.getItem('access_token');
}

export async function getRutas(): Promise<Ruta[]> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/rutas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as Ruta[];
}

export async function getRutaById(id: number): Promise<Ruta> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/rutas/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as Ruta;
}

export async function getRutasTodas(): Promise<Ruta[]> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/rutas/todas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as Ruta[];
}

export async function createRuta(data: CreateRutaDto): Promise<Ruta> {
  const token = getToken();
  const formData = new FormData();
  formData.append('paradaOrigenId', String(data.paradaOrigenId));
  formData.append('paradaDestinoId', String(data.paradaDestinoId));
  if (data.prioridad !== undefined) formData.append('prioridad', String(data.prioridad));
  if (data.fechaIniVigencia) formData.append('fechaIniVigencia', data.fechaIniVigencia);
  if (data.fechaFinVigencia) formData.append('fechaFinVigencia', data.fechaFinVigencia);
  if (data.estado !== undefined) formData.append('estado', String(data.estado));
  formData.append('diasOperacion', JSON.stringify(data.diasOperacion));
  formData.append('file', data.file);
  const res = await axios.post(`${API_URL}/rutas`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data as Ruta;
}

export async function updateRuta(id: number, data: UpdateRutaDto): Promise<Ruta> {
  const token = getToken();
  const formData = new FormData();
  if (data.paradaOrigenId !== undefined) formData.append('paradaOrigenId', String(data.paradaOrigenId));
  if (data.paradaDestinoId !== undefined) formData.append('paradaDestinoId', String(data.paradaDestinoId));
  if (data.prioridad !== undefined) formData.append('prioridad', String(data.prioridad));
  if (data.fechaIniVigencia) formData.append('fechaIniVigencia', data.fechaIniVigencia);
  if (data.fechaFinVigencia) formData.append('fechaFinVigencia', data.fechaFinVigencia);
  if (data.estado !== undefined) formData.append('estado', String(data.estado));
  if (data.diasOperacion) formData.append('diasOperacion', JSON.stringify(data.diasOperacion));
  if (data.file) formData.append('file', data.file);
  const res = await axios.patch(`${API_URL}/rutas/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data as Ruta;
}

export async function deleteRuta(id: number): Promise<void> {
  const token = getToken();
  await axios.delete(`${API_URL}/rutas/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
} 
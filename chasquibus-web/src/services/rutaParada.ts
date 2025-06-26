import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface RutaParada {
  id: number;
  rutaId: number;
  paradaId: number;
  orden: number;
  distanciaDesdeOrigenKm?: number;
  tiempoDesdeOrigenMin?: number;
  estado?: 'activa' | 'inactiva' | 'suspendida';
}

export interface CreateRutaParadaDto {
  rutaId: number;
  paradaId: number;
  orden: number;
  distanciaDesdeOrigenKm?: number;
  tiempoDesdeOrigenMin?: number;
}

export interface UpdateRutaParadaDto {
  rutaId?: number;
  paradaId?: number;
  orden?: number;
  distanciaDesdeOrigenKm?: number;
  tiempoDesdeOrigenMin?: number;
  estado?: 'activa' | 'inactiva' | 'suspendida';
}

function getToken() {
  return localStorage.getItem('access_token');
}

export async function getRutaParadas(): Promise<RutaParada[]> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/ruta-parada`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as RutaParada[];
}

export async function getRutaParadasByCooperativa(): Promise<RutaParada[]> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/ruta-parada/by-cooperativa`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as RutaParada[];
}

export async function getRutaParadaById(id: number): Promise<RutaParada> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/ruta-parada/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as RutaParada;
}

export async function createRutaParada(data: CreateRutaParadaDto): Promise<RutaParada> {
  const token = getToken();
  const res = await axios.post(`${API_URL}/ruta-parada`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data as RutaParada;
}

export async function updateRutaParada(id: number, data: UpdateRutaParadaDto): Promise<RutaParada> {
  const token = getToken();
  const res = await axios.patch(`${API_URL}/ruta-parada/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data as RutaParada;
}

export async function deleteRutaParada(id: number): Promise<void> {
  const token = getToken();
  await axios.delete(`${API_URL}/ruta-parada/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getRutaParadasByRutaId(rutaId: number): Promise<RutaParada[]> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/ruta-parada`, {
    params: { rutaId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as RutaParada[];
} 
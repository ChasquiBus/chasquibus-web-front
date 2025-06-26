import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface TarifaParada {
  id: number;
  rutaId: number;
  paradaOrigenId: number;
  paradaDestinoId: number;
  tipoAsiento?: string;
  valor: number | string;
  aplicaTarifa?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTarifaParadaDto {
  rutaId: number;
  paradaOrigenId: number;
  paradaDestinoId: number;
  tipoAsiento?: string;
  valor: number;
  aplicaTarifa?: boolean;
}

export interface UpdateTarifaParadaDto {
  tipoAsiento?: string;
  valor?: number;
  aplicaTarifa?: boolean;
}

function getToken() {
  return localStorage.getItem('access_token');
}

export async function getTarifasParadas(): Promise<TarifaParada[]> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/tarifas-paradas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as TarifaParada[];
}

export async function getTarifaParadaById(id: number): Promise<TarifaParada> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/tarifas-paradas/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as TarifaParada;
}

export async function getTarifasParadasByRutaId(rutaId: number): Promise<TarifaParada[]> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/tarifas-paradas/ruta/${rutaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as TarifaParada[];
}

export async function createTarifaParada(data: CreateTarifaParadaDto): Promise<TarifaParada> {
  const token = getToken();
  const res = await axios.post(`${API_URL}/tarifas-paradas`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data as TarifaParada;
}

export async function updateTarifaParada(id: number, data: UpdateTarifaParadaDto): Promise<TarifaParada> {
  const token = getToken();
  const res = await axios.patch(`${API_URL}/tarifas-paradas/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data as TarifaParada;
}

export async function deleteTarifaParada(id: number): Promise<void> {
  const token = getToken();
  await axios.delete(`${API_URL}/tarifas-paradas/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
} 
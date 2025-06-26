import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Parada {
  id: number;
  nombreParada: string;
  ciudadId: number;
  direccion?: string;
  esTerminal: boolean;
}

export interface CreateParadaDto {
  nombreParada: string;
  ciudadId: number;
  direccion?: string;
  esTerminal: boolean;
}

export interface UpdateParadaDto {
  nombreParada?: string;
  ciudadId?: number;
  direccion?: string;
  esTerminal?: boolean;
}

export async function getParadas(): Promise<Parada[]> {
  const token = localStorage.getItem('access_token');
  const res = await axios.get(`${API_URL}/paradas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data as Parada[];
}

export async function createParada(data: CreateParadaDto): Promise<Parada> {
  const token = localStorage.getItem('access_token');
  const res = await axios.post(`${API_URL}/paradas`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data as Parada;
}

export async function updateParada(id: number, data: UpdateParadaDto): Promise<Parada> {
  const token = localStorage.getItem('access_token');
  const res = await axios.patch(`${API_URL}/paradas/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data as Parada;
}

export async function deleteParada(id: number): Promise<Parada> {
  const token = localStorage.getItem('access_token');
  const res = await axios.delete(`${API_URL}/paradas/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data as Parada;
} 
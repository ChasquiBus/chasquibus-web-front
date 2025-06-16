import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Parada {
  id: number;
  ciudadId: number;
  nombreParada: string;
  direccion: string;
  esTerminal: boolean;
  cooperativaId: number;
  ciudad?: { provincia: string; ciudad: string } | null;
}

export interface CreateParadaDto {
  ciudadId: number;
  nombreParada: string;
  direccion: string;
  esTerminal: boolean;
  cooperativaId: number;
}

export interface UpdateParadaDto {
  ciudadId?: number;
  nombreParada?: string;
  direccion?: string;
  esTerminal?: boolean;
  cooperativaId?: number;
}

export async function getParadas(): Promise<Parada[]> {
  const res = await axios.get(`${API_URL}/paradas`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  return res.data as Parada[];
}

export async function createParada(data: CreateParadaDto): Promise<Parada> {
  const res = await axios.post(`${API_URL}/paradas`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data as Parada;
}

export async function updateParada(id: number, data: UpdateParadaDto): Promise<Parada> {
  const res = await axios.patch(`${API_URL}/paradas/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data as Parada;
}

export async function deleteParada(id: number): Promise<Parada> {
  const res = await axios.delete(`${API_URL}/paradas/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  return res.data as Parada;
} 
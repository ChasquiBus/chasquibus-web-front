import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Frequency {
  id: number;
  rutaId: number;
  horaSalidaProg: string;
  horaLlegadaProg: string;
  activo: boolean;
}

export interface CreateFrequencyDTO {
  rutaId: number;
  horaSalidaProg: string;
  horaLlegadaProg: string;
}

export interface UpdateFrequencyDTO {
  horaSalidaProg?: string;
  horaLlegadaProg?: string;
}

export async function getFrequenciesByCooperativa(): Promise<Frequency[]> {
  const token = localStorage.getItem('access_token');
  const res = await axios.get(`${API_URL}/frecuencias/cooperativa`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as Frequency[];
}

export async function getFrequenciesByRuta(rutaId: number): Promise<Frequency[]> {
  const token = localStorage.getItem('access_token');
  const res = await axios.get(`${API_URL}/frecuencias/ruta/${rutaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as Frequency[];
}

export async function createFrequency(dto: CreateFrequencyDTO): Promise<Frequency> {
  const token = localStorage.getItem('access_token');
  const res = await axios.post(`${API_URL}/frecuencias`, dto, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data as Frequency;
}

export async function updateFrequency(id: number, dto: UpdateFrequencyDTO): Promise<Frequency> {
  const token = localStorage.getItem('access_token');
  const res = await axios.patch(`${API_URL}/frecuencias/${id}`, dto, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data as Frequency;
}

export async function deleteFrequency(id: number): Promise<void> {
  const token = localStorage.getItem('access_token');
  await axios.delete(`${API_URL}/frecuencias/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
} 
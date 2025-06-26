import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Ciudad {
  id: number;
  provincia: string;
  ciudad: string;
  cooperativaId?: number;
}

export interface CreateCiudadDto {
  provincia: string;
  ciudad: string;
  cooperativaId: number;
}

export interface UpdateCiudadDto {
  provincia?: string;
  ciudad?: string;
  cooperativaId?: number;
}

export async function getCiudades(): Promise<Ciudad[]> {
  const res = await axios.get(`${API_URL}/ciudades`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  return res.data as Ciudad[];
}

export async function getCiudadById(id: number): Promise<Ciudad> {
  const res = await axios.get(`${API_URL}/ciudades/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  return res.data as Ciudad;
}

export async function createCiudad(data: CreateCiudadDto): Promise<Ciudad> {
  const res = await axios.post(`${API_URL}/ciudades`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data as Ciudad;
}

export async function updateCiudad(id: number, data: UpdateCiudadDto): Promise<Ciudad> {
  const res = await axios.patch(`${API_URL}/ciudades/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data as Ciudad;
}

export async function deleteCiudad(id: number): Promise<Ciudad> {
  const res = await axios.delete(`${API_URL}/ciudades/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  return res.data as Ciudad;
} 
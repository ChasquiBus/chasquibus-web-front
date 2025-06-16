import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Resolucion {
  id: number;
  nombre: string;
  descripcion?: string;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: boolean;
  enUso: boolean;
  documentoURL?: string;
  cooperativaId: number;
}

export async function getResoluciones(cooperativaId: number): Promise<Resolucion[]> {
  const res = await axios.get(`${API_URL}/resoluciones?cooperativaId=${cooperativaId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  return res.data as Resolucion[];
}

export async function createResolucion(formData: FormData): Promise<Resolucion> {
  if (!formData.get('file')) {
    throw new Error('Debes adjuntar un archivo PDF bajo el campo "file"');
  }
  const res = await axios.post(`${API_URL}/resoluciones`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  return res.data as Resolucion;
}

export async function updateResolucion(id: number, formData: FormData): Promise<Resolucion> {
  const res = await axios.patch(`${API_URL}/resoluciones/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  return res.data as Resolucion;
}

export async function deleteResolucion(id: number): Promise<{ message: string }> {
  const res = await axios.delete(`${API_URL}/resoluciones/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  return res.data as { message: string };
} 
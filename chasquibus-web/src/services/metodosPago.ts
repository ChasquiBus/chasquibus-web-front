import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface MetodoPago {
  id: number;
  cooperativaId: number;
  nombre: string;
  descripcion?: string;
  procesador?: string;
  configuracion?: string;
  activo: boolean;
}

export interface CreateMetodoPagoDto {
  cooperativaId: number;
  nombre: string;
  descripcion?: string;
  procesador?: string;
  configuracion?: string;
  activo?: boolean;
}

export interface UpdateMetodoPagoDto {
  nombre?: string;
  descripcion?: string;
  procesador?: string;
  configuracion?: string;
  activo?: boolean;
}

function getToken() {
  return localStorage.getItem('access_token');
}

export async function getAllMetodosPago(): Promise<MetodoPago[]> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/metodos-pago`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as MetodoPago[];
}

export async function getMetodosPagoActivos(): Promise<MetodoPago[]> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/metodos-pago/activos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as MetodoPago[];
}

export async function getMetodoPagoById(id: number): Promise<MetodoPago> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/metodos-pago/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as MetodoPago;
}

export async function createMetodoPago(data: CreateMetodoPagoDto): Promise<MetodoPago> {
  const token = getToken();
  const res = await axios.post(`${API_URL}/metodos-pago`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data as MetodoPago;
}

export async function updateMetodoPago(id: number, data: UpdateMetodoPagoDto): Promise<MetodoPago> {
  const token = getToken();
  const res = await axios.patch(`${API_URL}/metodos-pago/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data as MetodoPago;
}

export async function deleteMetodoPago(id: number): Promise<MetodoPago> {
  const token = getToken();
  const res = await axios.delete(`${API_URL}/metodos-pago/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as MetodoPago;
}

export async function toggleActiveMetodoPago(id: number): Promise<MetodoPago> {
  const token = getToken();
  const res = await axios.patch(`${API_URL}/metodos-pago/${id}/toggle-active`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as MetodoPago;
} 
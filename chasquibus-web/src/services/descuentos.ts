import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Descuento {
  id: number;
  tipoDescuento: string;
  requiereValidacion: boolean;
  porcentaje: string;
  estado: string;
}

function getToken() {
  return localStorage.getItem('access_token');
}

export async function getAllDescuentos(): Promise<Descuento[]> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/descuentos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as Descuento[];
}

export async function getDescuentoById(id: number): Promise<Descuento> {
  const token = getToken();
  const res = await axios.get(`${API_URL}/descuentos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as Descuento;
} 
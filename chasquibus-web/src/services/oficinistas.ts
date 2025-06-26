import axios from 'axios';
import { Oficinista, CreateOficinistaDto, UpdateOficinistaDto } from '@/types/oficinista';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getToken() {
  return localStorage.getItem('access_token');
}

export const oficinistasService = {
  // Obtener todos los oficinistas de la cooperativa
  getAllOficinistas: async (): Promise<Oficinista[]> => {
    const token = getToken();
    const response = await axios.get<Oficinista[]>(`${API_URL}/admin-cooperativas/obtener-oficinistas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Obtener un oficinista por ID
  getOficinistaById: async (id: number): Promise<Oficinista> => {
    const token = getToken();
    const response = await axios.get<Oficinista>(`${API_URL}/admin-cooperativas/obtener-oficinistas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Crear oficinista
  createOficinista: async (data: CreateOficinistaDto): Promise<Oficinista> => {
    const token = getToken();
    const response = await axios.post<Oficinista>(`${API_URL}/admin-cooperativas/crear-oficinista-coop`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Editar oficinista
  updateOficinista: async (id: number, data: UpdateOficinistaDto): Promise<Oficinista> => {
    const token = getToken();
    const response = await axios.patch<Oficinista>(`${API_URL}/admin-cooperativas/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Eliminar oficinista
  deleteOficinista: async (id: number): Promise<void> => {
    const token = getToken();
    await axios.delete(`${API_URL}/admin-cooperativas/oficinista/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
}; 
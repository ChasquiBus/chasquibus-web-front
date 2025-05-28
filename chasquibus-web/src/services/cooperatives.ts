import { Cooperativa, CreateCooperativaDto, UpdateCooperativaDto } from '@/types/cooperatives';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const cooperativesService = {
  async getAll(): Promise<Cooperativa[]> {
    const response = await fetch(`${API_URL}/cooperativas`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (!response.ok) throw new Error('Error al obtener las cooperativas');
    return response.json();
  },

  async getById(id: number): Promise<Cooperativa> {
    const response = await fetch(`${API_URL}/cooperativas/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (!response.ok) throw new Error('Error al obtener la cooperativa');
    return response.json();
  },

  async create(data: CreateCooperativaDto): Promise<Cooperativa> {
    const response = await fetch(`${API_URL}/cooperativas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al crear la cooperativa');
    return response.json();
  },

  async update(id: number, data: UpdateCooperativaDto): Promise<Cooperativa> {
    const response = await fetch(`${API_URL}/cooperativas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al actualizar la cooperativa');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/cooperativas/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (!response.ok) throw new Error('Error al eliminar la cooperativa');
  },
}; 
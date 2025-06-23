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

  async create(data: CreateCooperativaDto & { logo?: File }): Promise<Cooperativa> {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    if (data.ruc) formData.append('ruc', data.ruc);
    if (data.colorPrimario) formData.append('colorPrimario', data.colorPrimario);
    if (data.colorSecundario) formData.append('colorSecundario', data.colorSecundario);
    if (data.sitioWeb) formData.append('sitioWeb', data.sitioWeb);
    if (data.email) formData.append('email', data.email);
    if (data.telefono) formData.append('telefono', data.telefono);
    if (data.direccion) formData.append('direccion', data.direccion);
    if (data.logo) formData.append('logo', data.logo);
    const response = await fetch(`${API_URL}/cooperativas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Error al crear la cooperativa');
    return response.json();
  },

  async update(id: number, data: UpdateCooperativaDto & { logo?: File }): Promise<Cooperativa> {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    if (data.ruc) formData.append('ruc', data.ruc);
    if (data.colorPrimario) formData.append('colorPrimario', data.colorPrimario);
    if (data.colorSecundario) formData.append('colorSecundario', data.colorSecundario);
    if (data.sitioWeb) formData.append('sitioWeb', data.sitioWeb);
    if (data.email) formData.append('email', data.email);
    if (data.telefono) formData.append('telefono', data.telefono);
    if (data.direccion) formData.append('direccion', data.direccion);
    if (data.logo) formData.append('logo', data.logo);
    const response = await fetch(`${API_URL}/cooperativas/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
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
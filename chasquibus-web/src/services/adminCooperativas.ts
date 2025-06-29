import { AdminCooperativa, CreateAdminCooperativaDto } from '@/types/adminCooperativa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const adminCooperativasService = {
  async getAll(): Promise<AdminCooperativa[]> {
    const response = await fetch(`${API_URL}/admin-cooperativas/obtener-admins`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
    });
    if (!response.ok) throw new Error('Error al obtener los administradores');
    return response.json();
  },
  async create(data: CreateAdminCooperativaDto): Promise<AdminCooperativa> {
    const response = await fetch(`${API_URL}/admin-cooperativas/crear-admin-coop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al crear el administrador');
    return response.json();
  },
  async update(id: number, data: Partial<CreateAdminCooperativaDto>): Promise<AdminCooperativa> {
    const response = await fetch(`${API_URL}/admin-cooperativas/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al actualizar el administrador');
    return response.json();
  },
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/admin-cooperativas/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
    });
    if (!response.ok) throw new Error('Error al eliminar el administrador');
  },
  async getAllOficinistas(): Promise<any[]> {
    const response = await fetch(`${API_URL}/admin-cooperativas/obtener-oficinistas`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
    });
    if (!response.ok) throw new Error('Error al obtener los oficinistas');
    return response.json();
  },
  async getById(id: number): Promise<any> {
    const response = await fetch(`${API_URL}/admin-cooperativas/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
    });
    if (!response.ok) throw new Error('Error al obtener el admin/oficinista por ID');
    return response.json();
  },
}; 
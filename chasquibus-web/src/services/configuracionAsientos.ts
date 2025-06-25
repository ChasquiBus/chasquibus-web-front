import { Bus } from '@/types/bus';

export interface PosicionAsiento {
  fila: number;
  columna: number;
  piso: number;
  tipoAsiento: 'NORMAL' | 'VIP';
  numeroAsiento: number;
}

export interface ConfiguracionAsientos {
  id: number;
  busId: number;
  posicionesJson: string; // JSON.stringify(PosicionAsiento[])
}

export interface CreateConfiguracionAsientosDto {
  busId: number;
  posiciones: PosicionAsiento[];
}

export interface UpdateConfiguracionAsientosDto {
  posiciones?: PosicionAsiento[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const configuracionAsientosService = {
  async getAll(): Promise<ConfiguracionAsientos[]> {
    const response = await fetch(`${API_URL}/configuracion-asientos`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (!response.ok) throw new Error('Error al obtener las configuraciones de asientos');
    return response.json();
  },

  async getByBusId(busId: number): Promise<ConfiguracionAsientos | null> {
    const response = await fetch(`${API_URL}/configuracion-asientos/bus/${busId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Error al obtener la configuración de asientos del bus');
    const data = await response.json();
    // Puede devolver un array o un objeto, depende del backend
    if (Array.isArray(data)) return data[0] || null;
    return data;
  },

  async create(dto: CreateConfiguracionAsientosDto): Promise<ConfiguracionAsientos> {
    // Filtrar solo los campos requeridos por el backend en cada posición
    const posiciones = dto.posiciones.map(p => ({
      fila: p.fila,
      columna: p.columna,
      piso: p.piso,
      tipoAsiento: p.tipoAsiento,
      numeroAsiento: p.numeroAsiento,
      ocupado: false // siempre enviar false por defecto
    }));
    const body = JSON.stringify({ busId: dto.busId, posiciones });
    const response = await fetch(`${API_URL}/configuracion-asientos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
      body,
    });
    if (!response.ok) {
      let errorMsg = 'Error al crear la configuración de asientos';
      try {
        const data = await response.json();
        if (data && data.message) {
          errorMsg = Array.isArray(data.message) ? data.message.join(' ') : data.message;
        } else if (typeof data.error === 'string') {
          errorMsg = data.error;
        }
      } catch {}
      throw new Error(errorMsg);
    }
    return response.json();
  },

  async update(id: number, dto: UpdateConfiguracionAsientosDto): Promise<ConfiguracionAsientos> {
    // Filtrar solo los campos requeridos por el backend en cada posición
    let bodyObj: any = {};
    if (dto.posiciones) {
      bodyObj.posiciones = dto.posiciones.map(p => ({
        fila: p.fila,
        columna: p.columna,
        piso: p.piso,
        tipoAsiento: p.tipoAsiento,
        numeroAsiento: p.numeroAsiento,
        ocupado: false // siempre enviar false por defecto
      }));
    }
    const response = await fetch(`${API_URL}/configuracion-asientos/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyObj),
    });
    if (!response.ok) {
      let errorMsg = 'Error al actualizar la configuración de asientos';
      try {
        const data = await response.json();
        if (data && data.message) {
          errorMsg = Array.isArray(data.message) ? data.message.join(' ') : data.message;
        } else if (typeof data.error === 'string') {
          errorMsg = data.error;
        }
      } catch {}
      throw new Error(errorMsg);
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/configuracion-asientos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (!response.ok) throw new Error('Error al eliminar la configuración de asientos');
  },
}; 
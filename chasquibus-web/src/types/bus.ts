export interface Bus {
  id: number;
  cooperativa_id: number;
  placa: string;
  numero_bus: string;
  marca_chasis?: string;
  marca_carroceria?: string;
  imagen?: string;
  piso_doble: boolean;
  total_asientos: number;
  activo?: boolean;
}

export interface CreateBusDto {
  cooperativa_id: number;
  placa: string;
  numero_bus: string;
  marca_chasis?: string;
  marca_carroceria?: string;
  imagen?: string;
  piso_doble: boolean;
  total_asientos: number;
  activo?: boolean;
}

export interface UpdateBusDto extends Partial<CreateBusDto> {} 
export interface Bus {
  id: number;
  cooperativa_id: number;
  chofer_id: number;
  placa: string;
  numero_bus: string;
  marca_chasis?: string;
  marca_carroceria?: string;
  imagen?: string;
  piso_doble?: boolean;
}

export interface CreateBusDto {
  cooperativa_id: number;
  chofer_id: number;
  placa: string;
  numero_bus: string;
  marca_chasis?: string;
  marca_carroceria?: string;
  imagen?: string;
  piso_doble?: boolean;
}

export interface UpdateBusDto extends Partial<CreateBusDto> {} 
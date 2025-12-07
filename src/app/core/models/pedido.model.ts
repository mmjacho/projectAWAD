export type EstadoPedido = 'PENDIENTE' | 'PAGADO' | 'ANULADO';

export interface DetallePedido {
  loteId: number;
  codigoLote: string; // Para mostrar sin buscar
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  fecha: Date;
  numeroFactura: string; // Ej: FAC-001
  items: DetallePedido[];
  total: number;
  estado: EstadoPedido;
  observaciones?: string;
}
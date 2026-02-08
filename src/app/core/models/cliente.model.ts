export interface Cliente {
  id: number;
  ruc: string;
  razonSocial: string;
  email: string;
  telefono: string;
  tipo: 'Nacional' | 'Extranjero';
  anulado: boolean; // Coincide con backend
}
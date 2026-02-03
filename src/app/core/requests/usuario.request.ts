export interface UsuarioRequest {
  transaccion: string;
  // Campos opcionales porque no siempre se envían todos
  id?: number;
  codigo?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  cedula?: string;
  contrasenia?: string;
  rolId?: number; 
  activo?: boolean;
}
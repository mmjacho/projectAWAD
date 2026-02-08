export interface Usuario {
  id: number;
  codigo: string;    
  nombre: string;
  apellido: string;
  email: string;
  cedula: string;     
  contrasenia?: string; 
  rolId: number;      // Cambiado de 'rol' string a ID numérico
  anulado: boolean;   
}
// Hacemos esta interfaz genérica <T> para reutilizarla en TODAS las respuestas
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorCode?: number;
  data: T;
}
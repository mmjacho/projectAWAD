export interface Parcela {
  id: number;
  nombre: string;       // Ej: "Lote del Río", "Sector Norte"
  variedad: string;     // Ej: "Arábica", "Robusta", "Caturra"
  area: number;         // Área cultivada en hectáreas
  descripcion?: string; // Notas adicionales (opcional)
  fincaId: number;      // Relación con la Finca
  activa: boolean;
}
export interface Movimiento {
    id: number,
    loteId: number,
    fecha: Date,
    tipo: string,
    cantidad: number,
    esEntrada: boolean,
    motivo: string
}
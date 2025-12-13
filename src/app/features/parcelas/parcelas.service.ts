import { Injectable, signal } from '@angular/core';
import { Parcela } from '../../core/models/parcela.model';

// Datos de prueba (conectados con los IDs de las fincas anteriores)
const MOCK_PARCELAS: Parcela[] = [
  { id: 1, nombre: 'Sector Bajo', variedad: 'Arábica', area: 5.0, fincaId: 1, activa: true },
  { id: 2, nombre: 'Loma Alta', variedad: 'Robusta', area: 3.5, fincaId: 1, activa: true },
  { id: 3, nombre: 'El Plan', variedad: 'Caturra', area: 4.0, fincaId: 2, activa: true },
];

@Injectable({
  providedIn: 'root',
})
export class ParcelasService {
  private _parcelas = signal<Parcela[]>(MOCK_PARCELAS);
  private _nextId = signal(MOCK_PARCELAS.length + 1);

  public readonly parcelas = this._parcelas.asReadonly();

  constructor() {}

  addParcela(parcela: Omit<Parcela, 'id'>) {
    const nueva = { ...parcela, id: this._nextId() };
    this._parcelas.update(lista => [...lista, nueva]);
    this._nextId.update(id => id + 1);
  }

  updateParcela(parcela: Parcela) {
    this._parcelas.update(lista =>
      lista.map(p => (p.id === parcela.id ? parcela : p))
    );
  }

  deleteParcela(id: number) {
    this._parcelas.update(lista => lista.filter(p => p.id !== id));
  }
}

import { Injectable, signal } from '@angular/core';
import { Finca } from '../../core/models/finca.model';

// Datos quemados para pruebas
const MOCK_FINCAS: Finca[] = [
  { id: 1, nombre: 'La Esperanza', ubicacion: 'Manabí, Zona Alta', hectareas: 10.5, productorId: 1, activa: true },
  { id: 2, nombre: 'El Cafetal', ubicacion: 'Loja, Vilcabamba', hectareas: 5.0, productorId: 2, activa: true },
  { id: 3, nombre: 'San Antonio', ubicacion: 'El Oro, Zaruma', hectareas: 12.0, productorId: 1, activa: true },
];


@Injectable({
  providedIn: 'root',
})
export class FincasService {
  private _fincas = signal<Finca[]>(MOCK_FINCAS);
  private _nextId = signal(MOCK_FINCAS.length + 1);

  public readonly fincas = this._fincas.asReadonly();

  constructor() {}

  addFinca(finca: Omit<Finca, 'id'>) {
    const nuevaFinca = { ...finca, id: this._nextId() };
    this._fincas.update(lista => [...lista, nuevaFinca]);
    this._nextId.update(id => id + 1);
  }

  updateFinca(fincaActualizada: Finca) {
    this._fincas.update(lista =>
      lista.map(f => (f.id === fincaActualizada.id ? fincaActualizada : f))
    );
  }

  deleteFinca(id: number) {
    this._fincas.update(lista => lista.filter(f => f.id !== id));
  }
}

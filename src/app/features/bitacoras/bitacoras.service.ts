import { Injectable, signal } from '@angular/core';
import { Bitacora } from '../../core/models/bitacora.model';

const MOCK_BITACORA: Bitacora[] = [
  { 
    id: 1, 
    parcelaId: 1, 
    fecha: new Date('2024-01-15'), 
    tipo: 'LABOR', 
    nombreEvento: 'Poda de Formación', 
    severidad: null, 
    notas: 'Se realizó poda en luna menguante.' 
  },
  { 
    id: 2, 
    parcelaId: 1, 
    fecha: new Date('2024-02-10'), 
    tipo: 'PLAGA', 
    nombreEvento: 'Roya', 
    severidad: 'MEDIA', 
    notas: 'Detectado en hojas bajas. Se aplicó control orgánico.' 
  },
  { 
    id: 3, 
    parcelaId: 2, 
    fecha: new Date('2024-02-12'), 
    tipo: 'PLAGA', 
    nombreEvento: 'Broca', 
    severidad: 'ALTA', 
    notas: 'Afectación del 40% del fruto. Requiere intervención inmediata.' 
  }
];

@Injectable({
  providedIn: 'root',
})
export class BitacorasService {
  private _registros = signal<Bitacora[]>(MOCK_BITACORA);
  private _nextId = signal(MOCK_BITACORA.length + 1);

  public readonly registros = this._registros.asReadonly();

  constructor() {}

  addRegistro(registro: Omit<Bitacora, 'id'>) {
    const nuevo = { ...registro, id: this._nextId() };
    this._registros.update(lista => [nuevo, ...lista]); // Agregamos al inicio para ver lo reciente primero
    this._nextId.update(id => id + 1);
  }

  updateRegistro(actualizado: Bitacora) {
    this._registros.update(lista =>
      lista.map(r => (r.id === actualizado.id ? actualizado : r))
    );
  }

  deleteRegistro(id: number) {
    this._registros.update(lista => lista.filter(r => r.id !== id));
  }
}

import { Injectable, signal } from '@angular/core';
import { Productor } from '../../core/models/productor.model';

// Datos quemados para pruebas
const MOCK_PRODUCTORES: Productor[] = [
  { 
    id: 1, 
    cedula: '0912345678', 
    nombre: 'Juan', 
    apellido: 'Valdez', 
    email: 'juan.valdez@cafe.com', 
    telefono: '0991112222', 
    direccion: 'Vía a la Costa km 20', 
    activo: true 
  },
  { 
    id: 2, 
    cedula: '0987654321', 
    nombre: 'María', 
    apellido: 'Loor', 
    email: 'maria.loor@finca.com', 
    telefono: '0993334444', 
    direccion: 'Recinto El Triunfo', 
    activo: true 
  },
  { 
    id: 3, 
    cedula: '1205556667', 
    nombre: 'Pedro', 
    apellido: 'Páramo', 
    email: 'pedro@comala.com', 
    telefono: '0985556666', 
    direccion: 'Sector Las Lomas', 
    activo: false 
  },
];

@Injectable({
  providedIn: 'root',
})
export class ProductoresService {
  // Angular 20: Signals siguen siendo el núcleo de la reactividad
  private _productores = signal<Productor[]>(MOCK_PRODUCTORES);
  private _nextId = signal(MOCK_PRODUCTORES.length + 1);

  public readonly productores = this._productores.asReadonly();

  constructor() {}

  addProductor(productor: Omit<Productor, 'id'>) {
    const nuevoProductor = { ...productor, id: this._nextId() };
    this._productores.update(lista => [...lista, nuevoProductor]);
    this._nextId.update(id => id + 1);
  }

  updateProductor(productorActualizado: Productor) {
    this._productores.update(lista =>
      lista.map(p => (p.id === productorActualizado.id ? productorActualizado : p))
    );
  }

  deleteProductor(id: number) {
    this._productores.update(lista => lista.filter(p => p.id !== id));
  }
}

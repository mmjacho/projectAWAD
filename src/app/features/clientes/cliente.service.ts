import { Injectable, signal } from '@angular/core';
import { Cliente } from '../../core/models/cliente.model';

// Datos quemados
const MOCK_CLIENTES: Cliente[] = [
  { id: 1, ruc: '12345678901', razonSocial: 'Exportadora del Sur S.A.', email: 'compras@exposur.com', telefono: '0987654321', tipo: 'Nacional' },
  { id: 2, ruc: '98765432101', razonSocial: 'Café de Montaña C.A.', email: 'gerencia@cafemontana.com', telefono: '0991234567', tipo: 'Nacional' },
  { id: 3, ruc: '11122233345', razonSocial: 'Global Coffee Importers', email: 'buyer@globalcoffee.com', telefono: '+1555123456', tipo: 'Extranjero' },
];

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private _clientes = signal<Cliente[]>(MOCK_CLIENTES);
  private _nextId = signal(MOCK_CLIENTES.length + 1);

  public readonly clientes = this._clientes.asReadonly();

  constructor() {}

  // Añadir cliente
  addCliente(cliente: Omit<Cliente, 'id'>) {
    const nuevoCliente = { ...cliente, id: this._nextId() };
    this._clientes.update(clientes => [...clientes, nuevoCliente]);
    this._nextId.update(id => id + 1);
  }

  // Actualizar cliente
  updateCliente(clienteActualizado: Cliente) {
    this._clientes.update(clientes =>
      clientes.map(c => (c.id === clienteActualizado.id ? clienteActualizado : c))
    );
  }

  // Eliminar cliente
  deleteCliente(id: number) {
    this._clientes.update(clientes => clientes.filter(c => c.id !== id));
  }
}
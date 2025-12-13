import { Injectable, signal } from '@angular/core';
import { Usuario } from '../../core/models/usuario.model';

// Datos quemados
const MOCK_USUARIOS: Usuario[] = [
  { id: 1, nombre: 'Ana', apellido: 'García', email: 'ana.garcia@email.com', rol: 'Admin', activo: true },
  { id: 2, nombre: 'Luis', apellido: 'Martínez', email: 'luis.martinez@email.com', rol: 'Productor', activo: true },
  { id: 3, nombre: 'Sofía', apellido: 'Hernández', email: 'sofia.h@email.com', rol: 'Cliente', activo: false },
  { id: 4, nombre: 'Carlos', apellido: 'López', email: 'carlos.lopez@email.com', rol: 'Productor', activo: true },
];

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private _usuarios = signal<Usuario[]>(MOCK_USUARIOS);
  private _nextId = signal(MOCK_USUARIOS.length + 1);

  // Expone la señal como readonly
  public readonly usuarios = this._usuarios.asReadonly();

  constructor() {}

  // Añadir usuario
  addUser(usuario: Omit<Usuario, 'id'>) {
    const nuevoUsuario = { ...usuario, id: this._nextId() };
    this._usuarios.update(usuarios => [...usuarios, nuevoUsuario]);
    this._nextId.update(id => id + 1);
  }

  // Actualizar usuario
  updateUser(usuarioActualizado: Usuario) {
    this._usuarios.update(usuarios =>
      usuarios.map(u => (u.id === usuarioActualizado.id ? usuarioActualizado : u))
    );
  }

  // Eliminar usuario
  deleteUser(id: number) {
    this._usuarios.update(usuarios => usuarios.filter(u => u.id !== id));
  }
}
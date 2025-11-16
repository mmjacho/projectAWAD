import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../../core/models/usuario.model';
import { UsuarioService } from './usuario.service';
import { UsuarioDialogComponent } from './usuario-dialog.component';

// --- Imports de Angular Material ---
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms'; // Para el ngModel del filtro

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent {
  private usuarioService = inject(UsuarioService);
  private dialog = inject(MatDialog);

  public displayedColumns: string[] = ['id', 'nombreCompleto', 'email', 'rol', 'activo', 'acciones'];
  
  // Señales para el filtrado
  public filtro = signal<string>('');
  
  // Señal computada para filtrar usuarios
  public usuariosFiltrados = computed(() => {
    const usuarios = this.usuarioService.usuarios();
    const filtroLower = this.filtro().toLowerCase();

    if (!filtroLower) {
      return usuarios;
    }

    return usuarios.filter(u =>
      u.nombre.toLowerCase().includes(filtroLower) ||
      u.apellido.toLowerCase().includes(filtroLower) ||
      u.email.toLowerCase().includes(filtroLower) ||
      u.rol.toLowerCase().includes(filtroLower)
    );
  });

  // Método para el input de filtro
  onFiltroChange(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.filtro.set(valor);
  }

  // Abrir diálogo para crear o editar
  openDialog(usuario?: Usuario): void {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '450px',
      panelClass: 'dialog-cafe',
      data: usuario ? { ...usuario } : null, // Pasa una copia para evitar mutaciones
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          // Es una actualización
          this.usuarioService.updateUser(result);
        } else {
          // Es uno nuevo
          this.usuarioService.addUser(result);
        }
      }
    });
  }

  // Eliminar usuario
  eliminarUsuario(id: number): void {
    // Aquí podrías agregar un diálogo de confirmación
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      this.usuarioService.deleteUser(id);
    }
  }
}
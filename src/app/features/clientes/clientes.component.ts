import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from '../../core/models/cliente.model';
import { ClienteService } from './cliente.service';
import { ClienteDialogComponent } from './cliente-dialog.component';

// --- Imports de Angular Material ---
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms'; // Para el ngModel del filtro

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})
export class ClientesComponent {
  private clienteService = inject(ClienteService);
  private dialog = inject(MatDialog);

  public displayedColumns: string[] = ['id', 'ruc', 'razonSocial', 'email', 'telefono', 'tipo', 'acciones'];
  
  public filtro = signal<string>('');
  
  public clientesFiltrados = computed(() => {
    const clientes = this.clienteService.clientes();
    const filtroLower = this.filtro().toLowerCase();

    if (!filtroLower) {
      return clientes;
    }

    return clientes.filter(c =>
      c.ruc.toLowerCase().includes(filtroLower) ||
      c.razonSocial.toLowerCase().includes(filtroLower) ||
      c.email.toLowerCase().includes(filtroLower)
    );
  });

  onFiltroChange(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.filtro.set(valor);
  }

  openDialog(cliente?: Cliente): void {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      width: '450px',
      panelClass: 'dialog-cafe',
      data: cliente ? { ...cliente } : null,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.clienteService.updateCliente(result);
        } else {
          this.clienteService.addCliente(result);
        }
      }
    });
  }

  eliminarCliente(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
      this.clienteService.deleteCliente(id);
    }
  }
}
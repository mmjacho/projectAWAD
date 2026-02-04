import { Component, computed, inject, signal } from '@angular/core';
// Angular 20: No importamos CommonModule, usamos bloques @if directamente en el template
import { MatDialog } from '@angular/material/dialog';
import { Productor } from '../../core/models/productor.model';
import { ProductoresService } from './productores.service';
import { ProductoresDialog } from './productores-dialog/productores-dialog';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-productores',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './productores.html',
  styleUrl: './productores.css'
})

export class Productores {
private productorService = inject(ProductoresService);
  private dialog = inject(MatDialog);

  public displayedColumns: string[] = ['cedula', 'nombreCompleto', 'contacto', 'direccion', 'activo', 'acciones'];
  
  public filtro = signal<string>('');
  
  public productoresFiltrados = computed(() => {
    const lista = this.productorService.productores();
    const filtroLower = this.filtro().toLowerCase();

    if (!filtroLower) return lista;

    return lista.filter(p =>
      p.nombre.toLowerCase().includes(filtroLower) ||
      p.apellido.toLowerCase().includes(filtroLower) ||
      p.cedula.includes(filtroLower)
    );
  });

  onFiltroChange(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.filtro.set(valor);
  }

  openDialog(productor?: Productor): void {
    const dialogRef = this.dialog.open(ProductoresDialog, {
      width: '600px',
      panelClass: 'dialog-cafe',
      data: productor ? { ...productor } : null,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.productorService.updateProductor(result).subscribe({
            next: (res) => res.success ? alert('Actualizado') : alert(res.message),
            error: () => alert('Error de conexión')
          });
        } else {
          this.productorService.addProductor(result).subscribe({
            next: (res) => res.success ? alert('Creado') : alert(res.message),
            error: () => alert('Error de conexión')
          });
        }
      }
    });
  }

  eliminarProductor(id: number): void {
    if (confirm('¿Eliminar este productor?')) {
      this.productorService.deleteProductor(id).subscribe({
        next: (res) => res.success ? alert('Eliminado') : alert(res.message)
      });
    }
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Finca } from '../../core/models/finca.model';
import { FincasService } from './fincas.service';
import { ProductoresService } from '../productores/productores.service';
import { FincasDialog } from './fincas-dialog/fincas-dialog';

// Imports Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-fincas',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './fincas.html',
  styleUrl: './fincas.css',
})
export class Fincas {
private fincaService = inject(FincasService);
  private productorService = inject(ProductoresService); // Inyectamos para leer nombres
  private dialog = inject(MatDialog);

  public displayedColumns: string[] = ['nombre', 'productor', 'ubicacion', 'hectareas', 'activa', 'acciones'];
  
  public filtro = signal<string>('');

  public fincasFiltradas = computed(() => {
    const lista = this.fincaService.fincas();
    const filtroLower = this.filtro().toLowerCase();

    if (!filtroLower) return lista;

    return lista.filter(f => 
      f.nombre.toLowerCase().includes(filtroLower) || 
      f.ubicacion.toLowerCase().includes(filtroLower)
    );
  });

  // Helper para mostrar el nombre del Productor en la tabla
  getNombreProductor(id: number): string {
    const prod = this.productorService.productores().find(p => p.id === id);
    return prod ? `${prod.nombre} ${prod.apellido}` : 'Desconocido';
  }

  onFiltroChange(event: Event) {
    this.filtro.set((event.target as HTMLInputElement).value);
  }

  openDialog(finca?: Finca): void {
    const dialogRef = this.dialog.open(FincasDialog, {
      width: '500px',
      panelClass: 'dialog-cafe',
      data: finca ? { ...finca } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.fincaService.updateFinca(result);
        } else {
          this.fincaService.addFinca(result);
        }
      }
    });
  }

  eliminarFinca(id: number): void {
    if (confirm('¿Está seguro de eliminar esta finca?')) {
      this.fincaService.deleteFinca(id);
    }
  }
}

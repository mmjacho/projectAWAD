import { Component, computed, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Parcela } from '../../core/models/parcela.model';
import { ParcelasService } from './parcelas.service';
import { FincasService } from '../fincas/fincas.service'; // Para obtener nombres de fincas
import { ParcelasDialog } from './parcelas-dialog/parcelas-dialog';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips'; // Para la variedad
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-parcelas',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './parcelas.html',
  styleUrl: './parcelas.css',
})
export class Parcelas {
private parcelaService = inject(ParcelasService);
  private fincaService = inject(FincasService);
  private dialog = inject(MatDialog);

  public displayedColumns: string[] = ['nombre', 'variedad', 'finca', 'area', 'acciones'];
  public filtro = signal<string>('');

  // Helper para nombre de Variedad (Ahora por ID)
  getNombreVariedad(id: number): string {
    const v = this.parcelaService.variedades().find(x => x.id === id);
    return v ? v.nombre : 'Desconocida';
  }
  
  public parcelasFiltradas = computed(() => {
    const lista = this.parcelaService.parcelas();
    const txt = this.filtro().toLowerCase();
    
    if (!txt) return lista;

    return lista.filter(p => 
      p.nombre.toLowerCase().includes(txt) || 
      p.variedadNombre?.toLowerCase().includes(txt)
    );
  });

  // Helper para mostrar nombre de Finca
  getNombreFinca(id: number): string {
    const f = this.fincaService.fincas().find(x => x.id === id);
    return f ? f.nombre : 'Sin Finca';
  }

  onFiltroChange(event: Event) {
    this.filtro.set((event.target as HTMLInputElement).value);
  }

  openDialog(parcela?: Parcela): void {
    const dialogRef = this.dialog.open(ParcelasDialog, {
      width: '600px',
      panelClass: 'dialog-cafe',
      data: parcela ? { ...parcela } : null
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log("Datos a enviar:", res);
        
        if (res.id) {
          // ACTUALIZAR: Agregamos .subscribe()
          this.parcelaService.updateParcela(res).subscribe({
            next: (response) => {
                if(response.success) {
                    alert("Parcela actualizada correctamente");
                } else {
                    alert("Error: " + response.message);
                }
            },
            error: (err) => alert("Error de conexión al actualizar")
          });
        } else {
          // CREAR: Agregamos .subscribe()
          this.parcelaService.addParcela(res).subscribe({
            next: (response) => {
                if(response.success) {
                    alert("Parcela registrada correctamente");
                } else {
                    alert("Error: " + response.message);
                }
            },
            error: (err) => alert("Error de conexión al guardar")
          });
        }
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Borrar parcela?')) {
      // ELIMINAR: También faltaba el .subscribe() aquí
      this.parcelaService.deleteParcela(id).subscribe({
        next: (res) => {
             if(res.success) alert("Parcela eliminada");
        }
      });
    }
  }
}

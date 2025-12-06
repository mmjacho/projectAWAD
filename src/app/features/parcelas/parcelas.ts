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

  public parcelasFiltradas = computed(() => {
    const lista = this.parcelaService.parcelas();
    const txt = this.filtro().toLowerCase();
    
    if (!txt) return lista;

    return lista.filter(p => 
      p.nombre.toLowerCase().includes(txt) || 
      p.variedad.toLowerCase().includes(txt)
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
        if (res.id) this.parcelaService.updateParcela(res);
        else this.parcelaService.addParcela(res);
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Borrar parcela?')) {
      this.parcelaService.deleteParcela(id);
    }
  }
}

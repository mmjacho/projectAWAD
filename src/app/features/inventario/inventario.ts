import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common'; // Pipes útiles
import { MatDialog } from '@angular/material/dialog';
import { InventarioService } from './inventario.service';
import { ParcelasService } from '../parcelas/parcelas.service';
import { CosechasDialog } from './cosechas-dialog/cosechas-dialog';

// Material
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-inventario',
  imports: [
    CommonModule, 
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class Inventario {
 public inventarioService = inject(InventarioService);
  private parcelaService = inject(ParcelasService);
  private dialog = inject(MatDialog);

  // Columnas para tablas
  colsLotes = ['codigo', 'origen', 'fecha', 'calidad', 'stock', 'estado'];
  colsMovs = ['fecha', 'tipo', 'lote', 'cantidad', 'motivo'];

  // Signal computada local para el contador
  lotesActivosCount = computed(() => 
    this.inventarioService.lotes().filter(l => l.stockActual > 0).length
  );

  getNombreParcela(id: number): string {
    const p = this.parcelaService.parcelas().find(x => x.id === id);
    return p ? p.nombre : 'Unknown';
  }

  getCodigoLote(id: number): string {
    const l = this.inventarioService.lotes().find(x => x.id === id);
    return l ? l.codigo : `ID:${id}`;
  }

  openCosecha() {
    const ref = this.dialog.open(CosechasDialog, {
      width: '700px',
      panelClass: 'dialog-cafe'
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        // El servicio se encarga de todo (crear lote + crear movimiento)
        this.inventarioService.registrarCosecha(result);
      }
    });
  }
}

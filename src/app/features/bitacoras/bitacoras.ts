import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // DatePipe es útil aquí
import { MatDialog } from '@angular/material/dialog';
import { BitacorasService } from './bitacoras.service';
import { ParcelasService } from '../parcelas/parcelas.service';
import { BitacorasDialog } from './bitacoras-dialog/bitacoras-dialog';
import { Bitacora } from '../../core/models/bitacora.model';

// Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-bitacoras',
  imports: [
    CommonModule, // Para DatePipe
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './bitacoras.html',
  styleUrl: './bitacoras.css',
})
export class Bitacoras {
private bitacoraService = inject(BitacorasService);
  private parcelaService = inject(ParcelasService);
  private dialog = inject(MatDialog);

  public displayedColumns: string[] = ['fecha', 'parcela', 'evento', 'severidad', 'notas', 'acciones'];
  public filtro = signal('');

  public registrosFiltrados = computed(() => {
    const lista = this.bitacoraService.registros();
    const txt = this.filtro().toLowerCase();
    if (!txt) return lista;
    
    return lista.filter(r => 
      r.nombreEvento.toLowerCase().includes(txt) ||
      r.notas.toLowerCase().includes(txt)
    );
  });

  getNombreParcela(id: number): string {
    const p = this.parcelaService.parcelas().find(x => x.id === id);
    return p ? p.nombre : 'Desconocida';
  }

  getClaseSeveridad(sev: string | null): string {
    switch (sev) {
      case 'BAJA': return 'sev-baja';
      case 'MEDIA': return 'sev-media';
      case 'ALTA': return 'sev-alta';
      default: return '';
    }
  }

  onFiltroChange(e: Event) {
    this.filtro.set((e.target as HTMLInputElement).value);
  }

  openDialog(data?: Bitacora) {
    const ref = this.dialog.open(BitacorasDialog, {
      width: '600px',
      panelClass: 'dialog-cafe',
      data: data ? { ...data } : null
    });

    ref.afterClosed().subscribe(res => {
      if (res) {
        if (res.id) this.bitacoraService.updateRegistro(res);
        else this.bitacoraService.addRegistro(res);
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este registro de bitácora?')) {
      this.bitacoraService.deleteRegistro(id);
    }
  }
}

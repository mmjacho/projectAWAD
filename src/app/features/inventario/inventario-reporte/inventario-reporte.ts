import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';

// Servicios
import { InventarioReporteService } from './inventario-reporte.service';
import { InventarioService } from '../inventario.service';
import { ParcelasService } from '../../parcelas/parcelas.service';


@Component({
  selector: 'app-inventario-reporte',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule,
    MatProgressBarModule
  ],
  templateUrl: './inventario-reporte.html',
  styleUrl: './inventario-reporte.css',
})
export class InventarioReporte {
private fb = inject(FormBuilder);
  private inventarioService = inject(InventarioService);
  private parcelaService = inject(ParcelasService);
  private reporteService = inject(InventarioReporteService);

  filterForm: FormGroup;
  
  registrosEncontrados = signal(0);
  totalStockEncontrado = signal(0);
  datosVistaPrevia = signal<any[]>([]);

  constructor() {
    this.filterForm = this.fb.group({
      estado: ['DISPONIBLE'], // Por defecto solo ver lo disponible
      calidad: ['TODAS']
    });

    this.filterForm.valueChanges.subscribe(() => this.aplicarFiltros());
    
    // Carga inicial
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    const { estado, calidad } = this.filterForm.value;
    const lotes = this.inventarioService.lotes();

    const filtrados = lotes.filter(l => {
      let cumpleEstado = true;
      if (estado !== 'TODOS') {
        cumpleEstado = l.estado === estado;
      }

      let cumpleCalidad = true;
      if (calidad !== 'TODAS') {
        cumpleCalidad = l.calidad === calidad;
      }

      return cumpleEstado && cumpleCalidad;
    });

    this.datosVistaPrevia.set(filtrados);
    this.registrosEncontrados.set(filtrados.length);
    
    // Calcular stock total de lo filtrado
    const suma = filtrados.reduce((acc, curr) => acc + curr.stockActual, 0);
    this.totalStockEncontrado.set(suma);
  }

  exportar(formato: 'PDF' | 'EXCEL') {
    const datosListos = this.datosVistaPrevia().map(l => ({
      ...l,
      nombreParcela: this.getNombreParcela(l.parcelaId),
      fechaFormatted: formatDate(l.fechaCosecha, 'dd/MM/yyyy', 'en-US')
    }));

    if (formato === 'PDF') {
      this.reporteService.generarReporteInventarioPDF(datosListos, this.filterForm.value);
    } else {
      const excelData = datosListos.map(d => ({
        Codigo: d.codigo,
        Origen: d.nombreParcela,
        FechaCosecha: d.fechaFormatted,
        Calidad: d.calidad,
        StockInicial: d.cantidadInicial,
        StockActual: d.stockActual,
        Unidad: d.unidad,
        Estado: d.estado
      }));
      this.reporteService.exportarExcel(excelData, 'Reporte_Inventario_Stock');
    }
  }

  getNombreParcela(id: number): string {
    const p = this.parcelaService.parcelas().find(x => x.id === id);
    return p ? p.nombre : '...';
  }
}

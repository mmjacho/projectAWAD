import { Component, inject, signal } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core'; // Importar Locale
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

// Inyectamos servicios y modelo
import { BitacorasReporteService } from './bitacoras-reporte.service';
import { BitacorasService } from '../bitacoras.service';
import { ParcelasService } from '../../parcelas/parcelas.service';

@Component({
  selector: 'app-bitacoras-reporte',
  providers: [
    // FIX: Forzar formato dd/MM/yyyy en el datepicker
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule
  ],
  templateUrl: './bitacoras-reporte.html',
  styleUrl: './bitacoras-reporte.css',
})
export class BitacorasReporte {
 private fb = inject(FormBuilder);
  private bitacoraService = inject(BitacorasService);
  private parcelaService = inject(ParcelasService);
  private reporteService = inject(BitacorasReporteService);

  filterForm: FormGroup;
  
  registrosEncontrados = signal(0);
  datosVistaPrevia = signal<any[]>([]);

  constructor() {
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setDate(hoy.getDate() - 30);

    console.log(hoy);
    console.log(haceUnMes);
    this.filterForm = this.fb.group({
      inicio: [null],
      fin: [null],
      tipo: ['TODOS']
    });

    this.filterForm.valueChanges.subscribe(() => this.aplicarFiltros());
    
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    const { inicio, fin, tipo } = this.filterForm.value;
    const todos = this.bitacoraService.registros();

    const filtrados = todos.filter(r => {
      let cumpleFecha = true;

      // FIX: Normalizar fechas a medianoche para evitar problemas de horas
      if (inicio && fin) {
        // Crear copias para no mutar los originales
        const rDate = new Date(r.fecha); 
        rDate.setHours(0,0,0,0);

        const iDate = new Date(inicio);
        iDate.setHours(0,0,0,0);

        const fDate = new Date(fin);
        fDate.setHours(0,0,0,0);

        // Comparación por timestamp (inclusiva)
        cumpleFecha = rDate.getTime() >= iDate.getTime() && rDate.getTime() <= fDate.getTime();
      }
      
      let cumpleTipo = true;
      if (tipo !== 'TODOS') {
        cumpleTipo = r.tipo === tipo;
      }

      return cumpleFecha && cumpleTipo;
    });

    this.datosVistaPrevia.set(filtrados);
    this.registrosEncontrados.set(filtrados.length);
  }

  exportar(formato: 'PDF' | 'EXCEL') {
    const datosListos = this.datosVistaPrevia().map(r => ({
      ...r,
      nombreParcela: this.getNombreParcela(r.parcelaId),
      // Usar formatDate con locale en-US para obtener formato estándar, o 'es-ES' si prefieres
      fechaFormatted: formatDate(r.fecha, 'dd/MM/yyyy', 'en-US')
    }));

    if (formato === 'PDF') {
      this.reporteService.generarReporteBitacoraPDF(datosListos, this.filterForm.value);
    } else {
      const excelData = datosListos.map(d => ({
        Fecha: d.fechaFormatted,
        Parcela: d.nombreParcela,
        Tipo: d.tipo,
        Evento: d.nombreEvento,
        Severidad: d.severidad || '-',
        Notas: d.notas
      }));
      this.reporteService.exportarExcel(excelData, 'Reporte_Bitacora');
    }
  }

  getNombreParcela(id: number): string {
    const p = this.parcelaService.parcelas().find(x => x.id === id);
    return p ? p.nombre : '...';
  }
}

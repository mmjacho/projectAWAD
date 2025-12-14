import { Component, inject, signal } from '@angular/core';
import { CommonModule, formatDate, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

// Servicios
import { PedidosReporteService } from './pedidos-reporte.service';
import { PedidosService } from '../pedidos.service';
import { ClienteService } from '../../clientes/cliente.service';

@Component({
  selector: 'app-pedidos-reporte',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }], // Formato Fechas
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
  templateUrl: './pedidos-reporte.html',
  styleUrl: './pedidos-reporte.css',
})
export class PedidosReporte {
private fb = inject(FormBuilder);
  private pedidoService = inject(PedidosService);
  private clienteService = inject(ClienteService);
  private reporteService = inject(PedidosReporteService);

  filterForm: FormGroup;
  
  registrosEncontrados = signal(0);
  totalVentas = signal(0);
  datosVistaPrevia = signal<any[]>([]);

  constructor() {
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setDate(hoy.getDate() - 30);

    this.filterForm = this.fb.group({
      inicio: [null],
      fin: [null],
      estado: ['TODOS']
    });

    this.filterForm.valueChanges.subscribe(() => this.aplicarFiltros());
    
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    const { inicio, fin, estado } = this.filterForm.value;
    const pedidos = this.pedidoService.pedidos();

    const filtrados = pedidos.filter(p => {
      let cumpleFecha = true;
      if (inicio && fin) {
        // Normalizar fechas para evitar errores de hora
        const pDate = new Date(p.fecha); pDate.setHours(0,0,0,0);
        const iDate = new Date(inicio); iDate.setHours(0,0,0,0);
        const fDate = new Date(fin); fDate.setHours(0,0,0,0);

        cumpleFecha = pDate.getTime() >= iDate.getTime() && pDate.getTime() <= fDate.getTime();
      }
      
      let cumpleEstado = true;
      if (estado !== 'TODOS') {
        cumpleEstado = p.estado === estado;
      }

      return cumpleFecha && cumpleEstado;
    });

    this.datosVistaPrevia.set(filtrados);
    this.registrosEncontrados.set(filtrados.length);
    
    // Sumar totales
    const suma = filtrados.reduce((acc, curr) => acc + curr.total, 0);
    this.totalVentas.set(suma);
  }

  exportar(formato: 'PDF' | 'EXCEL') {
    const datosListos = this.datosVistaPrevia().map(p => ({
      ...p,
      nombreCliente: this.getNombreCliente(p.clienteId),
      fechaFormatted: formatDate(p.fecha, 'dd/MM/yyyy', 'es-ES')
    }));

    if (formato === 'PDF') {
      this.reporteService.generarReportePedidosPDF(datosListos, this.filterForm.value);
    } else {
      const excelData = datosListos.map(d => ({
        Factura: d.numeroFactura,
        Fecha: d.fechaFormatted,
        Cliente: d.nombreCliente,
        Total: d.total,
        Estado: d.estado
      }));
      this.reporteService.exportarExcel(excelData, 'Reporte_Ventas');
    }
  }

  getNombreCliente(id: number): string {
    const c = this.clienteService.clientes().find(x => x.id === id);
    return c ? c.razonSocial : 'Consumidor Final';
  }
}

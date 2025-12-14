import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

// Servicios
import { ClientesReporteService } from './clientes-reporte.service';
import { ClienteService } from '../cliente.service';

@Component({
  selector: 'app-clientes-reporte',
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
    MatDividerModule
  ],
  templateUrl: './clientes-reporte.html',
  styleUrl: './clientes-reporte.css',
})
export class ClientesReporte {
private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private reporteService = inject(ClientesReporteService);

  filterForm: FormGroup;
  
  registrosEncontrados = signal(0);
  datosVistaPrevia = signal<any[]>([]);

  constructor() {
    this.filterForm = this.fb.group({
      tipo: ['TODOS']
    });

    this.filterForm.valueChanges.subscribe(() => this.aplicarFiltros());
    
    // Carga inicial
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    const { tipo } = this.filterForm.value;
    const clientes = this.clienteService.clientes();

    const filtrados = clientes.filter(c => {
      let cumpleTipo = true;
      if (tipo !== 'TODOS') {
        cumpleTipo = c.tipo === tipo;
      }
      return cumpleTipo;
    });

    this.datosVistaPrevia.set(filtrados);
    this.registrosEncontrados.set(filtrados.length);
  }

  exportar(formato: 'PDF' | 'EXCEL') {
    const datosListos = this.datosVistaPrevia();

    if (formato === 'PDF') {
      this.reporteService.generarReporteClientesPDF(datosListos, this.filterForm.value);
    } else {
      const excelData = datosListos.map(c => ({
        RUC: c.ruc,
        RazonSocial: c.razonSocial,
        Email: c.email,
        Telefono: c.telefono,
        Tipo: c.tipo
      }));
      this.reporteService.exportarExcel(excelData, 'Reporte_Clientes');
    }
  }
}

import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx'; 
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ClientesReporteService {
  private datePipe = new DatePipe('en-ES');

  constructor() {}

  // ... (Métodos anteriores de Bitácora e Inventario) ...

  // ==========================================
  // 4. REPORTE CLIENTES (PDF)
  // ==========================================
  generarReporteClientesPDF(datos: any[], filtros: any) {
    const doc = new jsPDF();
    const fechaEmision = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

    // --- Encabezado ---
    doc.setFontSize(18);
    doc.setTextColor(62, 39, 35);
    doc.text('Reporte de Cartera de Clientes', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado el: ${fechaEmision}`, 14, 28);
    
    // Filtros
    let txtFiltro = `Tipo de Cliente: ${filtros.tipo}`;
    doc.text(txtFiltro, 14, 34);

    // --- Tabla ---
    const body = datos.map(c => [
      c.ruc,
      c.razonSocial,
      c.email,
      c.telefono,
      c.tipo
    ]);

    autoTable(doc, {
      head: [['RUC / ID', 'Razón Social', 'Email', 'Teléfono', 'Tipo']],
      body: body,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [62, 39, 35] },
      styles: { fontSize: 9 },
      didParseCell: (data) => {
        // Resaltar Clientes Extranjeros
        if (data.section === 'body' && data.column.index === 4) {
             if (data.cell.raw === 'Extranjero') {
                 data.cell.styles.textColor = [123, 31, 162]; // Morado
                 data.cell.styles.fontStyle = 'bold';
             }
        }
      }
    });

    doc.save(`clientes_${new Date().getTime()}.pdf`);
  }

  // ... (exportarExcel es reutilizable)
  exportarExcel(datos: any[], nombreArchivo: string, hojaNombre: string = 'Datos') {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, hojaNombre);
    XLSX.writeFile(wb, `${nombreArchivo}_${new Date().getTime()}.xlsx`);
  }
}

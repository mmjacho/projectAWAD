import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx'; // Importamos la librería de Excel
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class BitacorasReporteService {
  private datePipe = new DatePipe('en-US');

  constructor() {}

  // ==========================================
  // 1. REPORTE BITÁCORA (PDF)
  // ==========================================
  generarReporteBitacoraPDF(datos: any[], filtros: { inicio: Date | null, fin: Date | null, tipo: string }) {
    const doc = new jsPDF();
    const fechaEmision = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

    // --- Encabezado ---
    doc.setFontSize(18);
    doc.setTextColor(62, 39, 35);
    doc.text('Reporte de Bitácora de Campo', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado el: ${fechaEmision}`, 14, 28);
    
    // Mostrar filtros aplicados en el PDF
    let textoFiltro = 'Filtros: ';
    if (filtros.inicio && filtros.fin) {
        textoFiltro += `Del ${this.datePipe.transform(filtros.inicio, 'dd/MM/yyyy')} al ${this.datePipe.transform(filtros.fin, 'dd/MM/yyyy')}`;
    } else {
        textoFiltro += 'Histórico Completo';
    }
    if (filtros.tipo && filtros.tipo !== 'TODOS') {
        textoFiltro += ` | Tipo: ${filtros.tipo}`;
    }
    doc.text(textoFiltro, 14, 34);

    // --- Tabla ---
    const body = datos.map(item => [
      this.datePipe.transform(item.fecha, 'dd/MM/yyyy'),
      item.nombreParcela,
      item.tipo,
      item.nombreEvento,
      item.severidad || '-', 
      item.notas
    ]);

    autoTable(doc, {
      head: [['Fecha', 'Parcela', 'Tipo', 'Evento', 'Sev.', 'Observaciones']],
      body: body,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [62, 39, 35] },
      styles: { fontSize: 8 },
      didParseCell: (data) => {
        // Resaltar plagas graves en rojo
        if (data.section === 'body' && data.column.index === 4 && data.cell.raw === 'ALTA') {
            data.cell.styles.textColor = [198, 40, 40];
            data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    doc.save(`bitacora_${new Date().getTime()}.pdf`);
  }

  // ==========================================
  // 2. EXPORTAR A EXCEL (Genérico)
  // ==========================================
  exportarExcel(datos: any[], nombreArchivo: string, hojaNombre: string = 'Datos') {
    // 1. Crear Hoja de trabajo
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);

    // 2. Crear Libro de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, hojaNombre);

    // 3. Guardar archivo
    XLSX.writeFile(wb, `${nombreArchivo}_${new Date().getTime()}.xlsx`);
  }
}

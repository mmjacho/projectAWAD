import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx'; 
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class InventarioReporteService {
  private datePipe = new DatePipe('en-ES');

  constructor() {}

  // ... (Tus métodos anteriores de Bitácora) ...

  // ==========================================
  // 3. REPORTE INVENTARIO (PDF)
  // ==========================================
  generarReporteInventarioPDF(datos: any[], filtros: any) {
    const doc = new jsPDF();
    const fechaEmision = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

    // --- Encabezado ---
    doc.setFontSize(18);
    doc.setTextColor(62, 39, 35);
    doc.text('Reporte de Inventario (Lotes)', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado el: ${fechaEmision}`, 14, 28);
    
    // Filtros
    let txtFiltro = `Estado: ${filtros.estado}`;
    if (filtros.calidad !== 'TODAS') txtFiltro += ` | Calidad: ${filtros.calidad}`;
    doc.text(txtFiltro, 14, 34);

    // --- Tabla ---
    const body = datos.map(item => [
      item.codigo,
      item.nombreParcela, // Ya resuelto
      this.datePipe.transform(item.fechaCosecha, 'dd/MM/yyyy'),
      item.calidad,
      `${item.stockActual} / ${item.cantidadInicial} ${item.unidad}`, // Stock
      item.estado
    ]);

    autoTable(doc, {
      head: [['Código', 'Origen', 'Cosecha', 'Calidad', 'Stock Actual', 'Estado']],
      body: body,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [62, 39, 35] },
      styles: { fontSize: 9 },
      didParseCell: (data) => {
        // Resaltar Lotes Agotados
        if (data.section === 'body' && data.column.index === 5) {
             if (data.cell.raw === 'AGOTADO') {
                 data.cell.styles.textColor = [198, 40, 40]; // Rojo
             } else {
                 data.cell.styles.textColor = [46, 125, 50]; // Verde
             }
        }
      }
    });

    doc.save(`inventario_${new Date().getTime()}.pdf`);
  }

  // ... (El método exportarExcel es genérico, lo reusaremos)
  exportarExcel(datos: any[], nombreArchivo: string, hojaNombre: string = 'Datos') {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, hojaNombre);
    XLSX.writeFile(wb, `${nombreArchivo}_${new Date().getTime()}.xlsx`);
  }
}

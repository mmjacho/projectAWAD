import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx'; 
import { DatePipe, formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PedidosReporteService {
  private datePipe = new DatePipe('en-ES');

  constructor() {}

  // ... (Tus métodos anteriores: Bitácora, Inventario, Clientes) ...

  // ==========================================
  // 5. REPORTE PEDIDOS / VENTAS (PDF)
  // ==========================================
  generarReportePedidosPDF(datos: any[], filtros: any) {
    const doc = new jsPDF();
    const fechaEmision = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

    // --- Encabezado ---
    doc.setFontSize(18);
    doc.setTextColor(62, 39, 35);
    doc.text('Reporte de Ventas y Facturación', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado el: ${fechaEmision}`, 14, 28);
    
    // Filtros
    let txtFiltro = '';
    if (filtros.inicio && filtros.fin) {
        txtFiltro = `Periodo: ${this.datePipe.transform(filtros.inicio, 'dd/MM/yyyy')} al ${this.datePipe.transform(filtros.fin, 'dd/MM/yyyy')}`;
    }
    if (filtros.estado !== 'TODOS') {
        txtFiltro += ` | Estado: ${filtros.estado}`;
    }
    doc.text(txtFiltro, 14, 34);

    // --- Tabla ---
    const body = datos.map(p => [
      p.numeroFactura,
      p.fechaFormatted,
      p.nombreCliente,
      `$ ${p.total.toFixed(2)}`, // Formato moneda básico
      p.estado
    ]);

    autoTable(doc, {
      head: [['N° Factura', 'Fecha', 'Cliente', 'Total', 'Estado']],
      body: body,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [62, 39, 35] },
      styles: { fontSize: 10 },
      didParseCell: (data) => {
        // Colorear Estados
        if (data.section === 'body' && data.column.index === 4) {
             if (data.cell.raw === 'ANULADO') {
                 data.cell.styles.textColor = [198, 40, 40]; // Rojo
             } else if (data.cell.raw === 'PAGADO') {
                 data.cell.styles.textColor = [46, 125, 50]; // Verde
             }
        }
      }
    });

    // Total General al final
    const totalVentas = datos.reduce((acc: number, curr: any) => acc + curr.total, 0);
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Periodo: $ ${totalVentas.toFixed(2)}`, 14, finalY);

    doc.save(`ventas_${new Date().getTime()}.pdf`);
  }

  // ... (exportarExcel sigue igual)
  exportarExcel(datos: any[], nombreArchivo: string, hojaNombre: string = 'Datos') {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, hojaNombre);
    XLSX.writeFile(wb, `${nombreArchivo}_${new Date().getTime()}.xlsx`);
  }
}

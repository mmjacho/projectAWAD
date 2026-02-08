import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common'; // Pipes útiles
import { MatDialog } from '@angular/material/dialog';
import { PedidosService } from './pedidos.service';
import { ClienteService } from '../clientes/cliente.service';
import { PedidosForm } from './pedidos-form/pedidos-form';

// Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-pedidos',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos {
  public pedidoService = inject(PedidosService);
  private clienteService = inject(ClienteService);
  private dialog = inject(MatDialog);

  cols = ['factura', 'fecha', 'cliente', 'total', 'estado', 'acciones'];

  getNombreCliente(id: number): string {
    const c = this.clienteService.clientes().find(x => x.id === id);
    return c ? c.razonSocial : 'Consumidor Final';
  }

  openNuevaVenta() {
    const ref = this.dialog.open(PedidosForm, { width: '80vw', disableClose: true });

    ref.afterClosed().subscribe(res => {
        if (res) {
            // SUSCRIPCIÓN AL OBSERVABLE
            this.pedidoService.registrarPedido(res).subscribe({
                next: (response) => {
                    if (response.success) alert(`Venta generada: ${response.data.numeroFactura}`);
                    else alert("Error: " + response.message);
                },
                error: (e) => alert("Error de conexión al guardar venta")
            });
        }
    });
  }

  anular(id: number) {
    if(confirm('¿Anular esta factura? Se devolverá el stock.')) {
       this.pedidoService.anularPedido(id).subscribe({
           next: (res) => { if(res.success) alert("Factura anulada correctamente."); }
       });
    }
  }
}

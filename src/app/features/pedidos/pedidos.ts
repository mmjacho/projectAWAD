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
    const ref = this.dialog.open(PedidosForm, {
        width: '80vw', // Ocupa el 90% del ancho de la ventana
        height: '80vh', // Ocupa el 90% del alto de la ventana
        maxWidth: '100vw', // Permite que crezca hasta el borde si es necesario
        panelClass: 'dialog-cafe',
        disableClose: true // Evitar cierre accidental
    });

    ref.afterClosed().subscribe(res => {
        if (res) {
            this.pedidoService.registrarPedido(res);
        }
    });
  }

  anular(id: number) {
    if(confirm('¿Anular esta factura?')) {
        this.pedidoService.anularPedido(id);
    }
  }
}

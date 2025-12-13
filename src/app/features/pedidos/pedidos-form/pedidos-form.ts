import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ClienteService } from '../../clientes/cliente.service';
import { InventarioService } from '../../inventario/inventario.service';
import { DetallePedido } from '../../../core/models/pedido.model';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pedidos-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatDividerModule
  ],
  templateUrl: './pedidos-form.html',
  styleUrl: './pedidos-form.css',
})
export class PedidosForm {
private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<PedidosForm>);
  private snackBar = inject(MatSnackBar);
  
  public clienteService = inject(ClienteService);
  public inventarioService = inject(InventarioService);

  // Forms
  headerForm: FormGroup;
  itemForm: FormGroup;

  // Estado local de items
  items = signal<DetallePedido[]>([]);
  
  // Computada: Solo mostrar lotes con stock > 0
  lotesDisponibles = computed(() => 
    this.inventarioService.lotes().filter(l => l.stockActual > 0 && l.estado === 'DISPONIBLE')
  );

  // Computada: Total del pedido
  totalPedido = computed(() => 
    this.items().reduce((acc, curr) => acc + curr.subtotal, 0)
  );

  constructor() {
    this.headerForm = this.fb.group({
      clienteId: [null, Validators.required],
      fecha: [new Date(), Validators.required]
    });

    this.itemForm = this.fb.group({
      loteId: [null, Validators.required],
      cantidad: [null, [Validators.required, Validators.min(0.1)]],
      precio: [null, [Validators.required, Validators.min(0)]]
    });
  }

  agregarItem() {
    const { loteId, cantidad, precio } = this.itemForm.value;
    
    // Validación de Stock
    const lote = this.inventarioService.lotes().find(l => l.id === loteId);
    if (!lote) return;

    if (cantidad > lote.stockActual) {
        this.snackBar.open(`Stock insuficiente. Disponible: ${lote.stockActual}`, 'Cerrar', { duration: 3000 });
        return;
    }

    // Crear detalle
    const nuevoDetalle: DetallePedido = {
        loteId,
        codigoLote: lote.codigo,
        cantidad,
        precioUnitario: precio,
        subtotal: cantidad * precio
    };

    // Actualizar signal de items
    this.items.update(lista => [...lista, nuevoDetalle]);

    // Resetear form de item (menos el precio, por comodidad)
    this.itemForm.patchValue({ loteId: null, cantidad: null });
  }

  removerItem(index: number) {
    this.items.update(lista => lista.filter((_, i) => i !== index));
  }

  guardarPedido() {
    if (this.headerForm.invalid || this.items().length === 0) return;

    const pedidoFinal = {
        clienteId: this.headerForm.value.clienteId,
        fecha: this.headerForm.value.fecha,
        items: this.items(),
        total: this.totalPedido(),
        estado: 'PAGADO' as const // Asumimos pagado por ahora
    };

    this.dialogRef.close(pedidoFinal);
  }
}

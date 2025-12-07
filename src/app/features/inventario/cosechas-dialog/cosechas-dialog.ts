import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ParcelasService } from '../../parcelas/parcelas.service';
import { ProductoresService } from '../../productores/productores.service';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cosechas-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './cosechas-dialog.html',
  styleUrl: './cosechas-dialog.css',
})
export class CosechasDialog {
private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<CosechasDialog>);
  public parcelaService = inject(ParcelasService);
  // Inyectamos finca/productor para resolver nombres solo visualmente
  // En una app real haríamos un join en backend
  private productorService = inject(ProductoresService); 

  public form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      parcelaId: [null, Validators.required],
      fechaCosecha: [new Date(), Validators.required],
      cantidadInicial: [null, [Validators.required, Validators.min(0.1)]],
      unidad: ['qq', Validators.required],
      calidad: ['Primera', Validators.required],
      notas: ['']
    });
  }

  // Helper visual loco para mostrar nombre del dueño
  getProductor(fincaId: number): string {
      // Nota: Esto asume que tienes acceso a fincas en algun lado, 
      // si no, simplifícalo mostrando solo nombre parcela.
      return 'Propietario'; 
  }

  guardar() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}

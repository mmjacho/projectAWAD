import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Parcela } from '../../../core/models/parcela.model';
import { FincasService } from '../../fincas/fincas.service';
import { ProductoresService } from '../../productores/productores.service';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-parcelas-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  templateUrl: './parcelas-dialog.html',
  styleUrl: './parcelas-dialog.css',
})
export class ParcelasDialog {
private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<ParcelasDialog>);
  public data: Parcela | null = inject(MAT_DIALOG_DATA);
  
  // Servicios inyectados public para usarlos en el HTML (Angular 20 style)
  public fincaService = inject(FincasService);
  public productorService = inject(ProductoresService);

  protected parcelaForm: FormGroup;
  
  // Lista quemada de variedades comunes
  public variedades = ['Arábica', 'Robusta', 'Caturra', 'Borbón', 'Típica'];

  constructor() {
    this.parcelaForm = this.fb.group({
      id: [this.data?.id ?? null],
      nombre: [this.data?.nombre ?? '', Validators.required],
      variedad: [this.data?.variedad ?? '', Validators.required],
      area: [this.data?.area ?? 0, [Validators.required, Validators.min(0.1)]],
      fincaId: [this.data?.fincaId ?? null, Validators.required],
      descripcion: [this.data?.descripcion ?? ''],
      activa: [this.data?.activa ?? true]
    });
  }

  // Helper para mostrar nombre del dueño en el select de Fincas
  getNombreProductor(productorId: number): string {
    const p = this.productorService.productores().find(x => x.id === productorId);
    return p ? `${p.nombre} ${p.apellido}` : '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.parcelaForm.valid) {
      this.dialogRef.close(this.parcelaForm.value);
    }
  }
}

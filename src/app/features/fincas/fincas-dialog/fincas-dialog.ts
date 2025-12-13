import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Finca } from '../../../core/models/finca.model';
import { ProductoresService } from '../../productores/productores.service'; // Necesitamos los productores

// Imports de Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-fincas-dialog',
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
  templateUrl: './fincas-dialog.html',
  styleUrl: './fincas-dialog.css',
})
export class FincasDialog {
private fb = inject(FormBuilder);
  public productorService = inject(ProductoresService); // Inyectamos servicio público para usarlo en el template
  public dialogRef = inject(MatDialogRef<FincasDialog>);
  public data: Finca | null = inject(MAT_DIALOG_DATA);

  protected fincaForm: FormGroup;

  constructor() {
    this.fincaForm = this.fb.group({
      id: [this.data?.id ?? null],
      nombre: [this.data?.nombre ?? '', Validators.required],
      ubicacion: [this.data?.ubicacion ?? '', Validators.required],
      hectareas: [this.data?.hectareas ?? 0, [Validators.required, Validators.min(0)]],
      productorId: [this.data?.productorId ?? null, Validators.required],
      activa: [this.data?.activa ?? true]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.fincaForm.valid) {
      this.dialogRef.close(this.fincaForm.value);
    }
  }
}

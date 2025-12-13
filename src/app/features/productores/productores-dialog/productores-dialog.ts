import { Component, inject } from '@angular/core';
// Angular 20: Eliminamos CommonModule ya que usamos @if/@for nativos
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Productor } from '../../../core/models/productor.model';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-productores-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './productores-dialog.html',
  styleUrl: './productores-dialog.css',
})
export class ProductoresDialog {
// Angular 20: 'inject' es el estándar para dependencias
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<ProductoresDialog>);
  public data: Productor | null = inject(MAT_DIALOG_DATA);

  protected productorForm: FormGroup;

  constructor() {
    this.productorForm = this.fb.group({
      id: [this.data?.id ?? null],
      cedula: [this.data?.cedula ?? '', Validators.required],
      nombre: [this.data?.nombre ?? '', Validators.required],
      apellido: [this.data?.apellido ?? '', Validators.required],
      email: [this.data?.email ?? '', [Validators.email]],
      telefono: [this.data?.telefono ?? '', Validators.required],
      direccion: [this.data?.direccion ?? '', Validators.required],
      activo: [this.data?.activo ?? true, Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.productorForm.valid) {
      this.dialogRef.close(this.productorForm.value);
    }
  }
}

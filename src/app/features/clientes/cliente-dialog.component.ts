import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from '../../core/models/cliente.model';

// --- Imports de Angular Material ---
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-cliente-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './cliente-dialog.component.html',
})
export class ClienteDialogComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<ClienteDialogComponent>);
  public data: Cliente | null = inject(MAT_DIALOG_DATA);

  protected clienteForm: FormGroup;
  public tipos: Cliente['tipo'][] = ['Nacional', 'Extranjero'];

  constructor() {
    this.clienteForm = this.fb.group({
      id: [this.data?.id ?? null],
      ruc: [this.data?.ruc ?? '', Validators.required],
      razonSocial: [this.data?.razonSocial ?? '', Validators.required],
      email: [this.data?.email ?? '', [Validators.required, Validators.email]],
      telefono: [this.data?.telefono ?? '', Validators.required],
      tipo: [this.data?.tipo ?? 'Nacional', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.clienteForm.valid) {
      this.dialogRef.close(this.clienteForm.value);
    }
  }
}
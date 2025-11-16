import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../../core/models/usuario.model';

// --- Imports de Angular Material ---
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-usuario-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './usuario-dialog.component.html',
})
export class UsuarioDialogComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<UsuarioDialogComponent>);
  public data: Usuario | null = inject(MAT_DIALOG_DATA);

  protected usuarioForm: FormGroup;
  public roles: Usuario['rol'][] = ['Admin', 'Productor', 'Cliente'];

  constructor() {
    this.usuarioForm = this.fb.group({
      id: [this.data?.id ?? null],
      nombre: [this.data?.nombre ?? '', Validators.required],
      apellido: [this.data?.apellido ?? '', Validators.required],
      email: [this.data?.email ?? '', [Validators.required, Validators.email]],
      rol: [this.data?.rol ?? 'Cliente', Validators.required],
      activo: [this.data?.activo ?? true, Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.usuarioForm.valid) {
      this.dialogRef.close(this.usuarioForm.value);
    }
  }
}
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../../core/models/usuario.model';
import { UsuarioService } from './usuario.service'; // Importar servicio

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
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatButtonModule, MatInputModule, MatFormFieldModule,
    MatSelectModule, MatSlideToggleModule,
  ],
  templateUrl: './usuario-dialog.component.html',
})
export class UsuarioDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService); // Inyectar servicio para obtener roles
  public dialogRef = inject(MatDialogRef<UsuarioDialogComponent>);
  public data: Usuario | null = inject(MAT_DIALOG_DATA);

  protected usuarioForm: FormGroup;
  
  // Obtenemos los roles directamente de la señal del servicio
  public listaRoles = this.usuarioService.roles;

  constructor() {
    // Si data existe (edición), data.anulado vendrá de BD.
    // Si data.anulado es true, activoVisual debe ser false.
    // Si data.anulado es false, activoVisual debe ser true.
    const esActivo = this.data ? !this.data.anulado : true;

    this.usuarioForm = this.fb.group({
      id: [this.data?.id ?? null],
      codigo: [this.data?.codigo ?? '', Validators.required],
      cedula: [this.data?.cedula ?? '', [Validators.required, Validators.maxLength(10)]],
      nombre: [this.data?.nombre ?? '', Validators.required],
      apellido: [this.data?.apellido ?? '', Validators.required],
      email: [this.data?.email ?? '', [Validators.required, Validators.email]],
      // Contraseña requerida solo si no hay ID (Creación)
      contrasenia: [this.data?.contrasenia ?? '', this.data ? [] : [Validators.required]], 
      rolId: [this.data?.rolId ?? null, Validators.required],
      // Control auxiliar para el toggle visual
      activoVisual: [esActivo, Validators.required],
    });
  }

  ngOnInit() {
    // Asegurarnos de que los roles estén cargados
    if (this.listaRoles().length === 0) {
        this.usuarioService.loadRoles();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.usuarioForm.valid) {
      const formValue = this.usuarioForm.value;
      
      // Transformación final para devolver al componente padre
      const usuarioParaGuardar: Usuario = {
        ...formValue,
        // Convertimos el toggle visual (Activo) a lógica de negocio (Anulado)
        anulado: !formValue.activoVisual 
      };

      this.dialogRef.close(usuarioParaGuardar);
    }
  }
}
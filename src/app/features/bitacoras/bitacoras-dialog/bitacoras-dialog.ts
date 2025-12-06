import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Bitacora, TipoEvento } from '../../../core/models/bitacora.model';
import { ParcelasService } from '../../parcelas/parcelas.service';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-bitacoras-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonToggleModule
  ],
  templateUrl: './bitacoras-dialog.html',
  styleUrl: './bitacoras-dialog.css',
})
export class BitacorasDialog {
private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<BitacorasDialog>);
  public data: Bitacora | null = inject(MAT_DIALOG_DATA);
  public parcelaService = inject(ParcelasService);

  public form: FormGroup;
  // Signal para controlar la UI reactiva del tipo
  public esPlaga = signal(false);

  constructor() {
    this.form = this.fb.group({
      id: [this.data?.id ?? null],
      parcelaId: [this.data?.parcelaId ?? null, Validators.required],
      fecha: [this.data?.fecha ?? new Date(), Validators.required],
      tipo: [this.data?.tipo ?? 'LABOR', Validators.required],
      nombreEvento: [this.data?.nombreEvento ?? '', Validators.required],
      severidad: [this.data?.severidad ?? null],
      notas: [this.data?.notas ?? '']
    });

    // Inicializar estado del signal
    this.esPlaga.set(this.data?.tipo === 'PLAGA');
  }

  onTipoChange() {
    const tipo = this.form.get('tipo')?.value;
    this.esPlaga.set(tipo === 'PLAGA');

    // Resetear severidad si cambia a Labor
    if (tipo === 'LABOR') {
      this.form.get('severidad')?.setValue(null);
      this.form.get('severidad')?.clearValidators();
    } else {
      this.form.get('severidad')?.setValidators(Validators.required);
    }
    this.form.get('severidad')?.updateValueAndValidity();
    
    // Limpiar nombreEvento para obligar a reseleccionar
    this.form.get('nombreEvento')?.setValue('');
  }

  guardar() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}

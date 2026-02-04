import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Parcela } from '../../../core/models/parcela.model';
import { FincasService } from '../../fincas/fincas.service';
import { ProductoresService } from '../../productores/productores.service';
import { ParcelasService } from '../parcelas.service';

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
  public parcelaService = inject(ParcelasService);

  protected parcelaForm: FormGroup;
  
  // Lista quemada de variedades comunes
  //public variedades = ['Arábica', 'Robusta', 'Caturra', 'Borbón', 'Típica'];

  constructor() {
    // Si la data viene con anulado=true -> activaVisual=false
    const esActiva = this.data ? !this.data.anulado : true;

    this.parcelaForm = this.fb.group({
      id: [this.data?.id ?? null],
      nombre: [this.data?.nombre ?? '', Validators.required],
      
      // variedadId ahora guarda el ID numérico
      variedadId: [this.data?.variedadId ?? null, Validators.required],
      
      area: [this.data?.area ?? 0, [Validators.required, Validators.min(0.1)]],
      fincaId: [this.data?.fincaId ?? null, Validators.required],
      descripcion: [this.data?.descripcion ?? ''],
      activaVisual: [esActiva] 
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
        const val = this.parcelaForm.value;
        const toSave = {
            ...val,
            anulado: !val.activaVisual
        };
        this.dialogRef.close(toSave);
    }
  }
}

import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title text-center mb-4">Iniciar Sesión</h2>
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">Usuario</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    formControlName="username"
                    [class]="{'is-invalid': submitted() && loginForm.get('username')?.errors}"
                  >
                  @if (submitted() && loginForm.get('username')?.errors) {
                    <div class="invalid-feedback">
                      El usuario es requerido
                    </div>
                  }
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    formControlName="password"
                    [class]="{'is-invalid': submitted() && loginForm.get('password')?.errors}"
                  >
                  @if (submitted() && loginForm.get('password')?.errors) {
                    <div class="invalid-feedback">
                      La contraseña es requerida
                    </div>
                  }
                </div>
                <button type="submit" class="btn btn-primary w-100">Aceptar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class Login {
  protected readonly loginForm: FormGroup;
  protected readonly submitted = signal(false);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  protected onSubmit(): void {
    this.submitted.set(true);

    if (this.loginForm.valid) {
      alert('Se procederá a validar las credenciales de acceso');
      // TODO: Implementar la lógica de autenticación
    }
  }
}
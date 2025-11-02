import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  template: `
    <header class="bg-primary text-white p-3">
      <div class="container d-flex justify-content-between align-items-center">
        <h1 class="m-0">{{ companyName() }}</h1>
        <div>
          <button class="btn btn-outline-light me-2" (click)="onAboutClick()">Acerca de</button>
          <button class="btn btn-light" (click)="onLoginClick()">Iniciar Sesión</button>
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class Header {
  protected readonly companyName = signal('Mi Empresa');
  
  constructor(private router: Router) {}

  protected onAboutClick(): void {
    // TODO: Implementar navegación a la página Acerca de
  }

  protected onLoginClick(): void {
    this.router.navigate(['/login']);
  }
}
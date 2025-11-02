import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="bg-dark text-white text-center p-3 mt-auto">
      <div class="container">
        <p class="mb-0">© {{ currentYear }} Mi Empresa. Todos los derechos reservados.</p>
      </div>
    </footer>
  `
})
export class Footer {
  protected readonly currentYear = new Date().getFullYear();
}
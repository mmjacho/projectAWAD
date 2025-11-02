import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <app-header />
      <main class="flex-grow-1">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
  styles: []
})
export class App {}

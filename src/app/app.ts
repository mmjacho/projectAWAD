import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayout } from "./layout/main-layout/main-layout";
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [ MainLayout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}

export const appConfig = {
  providers: [provideRouter(routes)],
};
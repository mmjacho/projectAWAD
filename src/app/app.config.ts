import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http'; // Importante
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // <-- AÑADIR ESTA LÍNEA

import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(), // <-- Esta línea ahora funcionará
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Habilitar cliente HTTP con el interceptor y fetch API
    provideHttpClient(withInterceptors([authInterceptor]), withFetch())
  ]
};
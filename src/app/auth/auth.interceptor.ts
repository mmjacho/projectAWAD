import { HttpInterceptorFn, HttpHeaders } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  let authReq = req;

  if (token) {
    console.log('Token encontrado:', token);
    
    // Clonar la solicitud añadiendo el header de Authorization
    authReq = req.clone({
      headers: req.headers
        .set('Authorization', `Bearer ${token}`)
        // Solo añade estos headers si no están ya presentes
        .set('accept', req.headers.get('accept') || '*/*')
        .set('Content-Type', req.headers.get('Content-Type') || 'application/json')
    });

    console.log('Headers enviados:', authReq.headers.keys());
  }

  return next(authReq);
};
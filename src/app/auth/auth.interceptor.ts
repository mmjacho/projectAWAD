import { HttpInterceptorFn, HttpHeaders } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');


  /*if (token) {
    // Clonamos la petición para añadir el header de autorización
    const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }*/
  let httpHeaders = new HttpHeaders({

  });

  if (token) {
    httpHeaders = httpHeaders.set('accept', `*/*`);
    httpHeaders = httpHeaders.set('Content-Type', `application/json`);
    httpHeaders = httpHeaders.set('Authorization', `Bearer ${token}`);
  }

  const authReq = req.clone({
    headers: httpHeaders
  });

  return next(req);
};
const API_BASE = 'https://localhost:7091';
const API_PATH = '/api';

export const environment = {
  production: false,

  apiUrl: API_BASE + API_PATH,
  UrlServicioAutorizacion: API_BASE + API_PATH + '/Autorizacion/VerificarAutorizacion'
};
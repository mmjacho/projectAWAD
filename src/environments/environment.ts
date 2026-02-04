const API_BASE = 'https://localhost:7091';
const API_PATH = '/api';

export const environment = {
  production: false,

  apiUrl: API_BASE + API_PATH,
  UrlServicioAutorizacion: API_BASE + API_PATH + '/Autorizacion/VerificarAutorizacion',
  UrlServicioGetUsuario: API_BASE + API_PATH + '/Usuario/GetUsuarioTransaccion',
  UrlServicioSetUsuario: API_BASE + API_PATH + '/Usuario/SetUsuarioTransaccion',
  UrlServicioGetRoles: API_BASE + API_PATH + '/Roles/GetRolesTransaccion',
  UrlServicioGetProductor: API_BASE + API_PATH + '/Productor/GetProductoresTransaccion',
  UrlServicioSetProductor: API_BASE + API_PATH + '/Productor/SetProductorTransaccion',
  UrlServicioGetFinca: API_BASE + API_PATH + '/Finca/GetFincasTransaccion',
  UrlServicioSetFinca: API_BASE + API_PATH + '/Finca/SetFincaTransaccion',
  UrlServicioGetParcela: API_BASE + API_PATH + '/Parcela/GetParcelasTransaccion',
  UrlServicioSetParcela: API_BASE + API_PATH + '/Parcela/SetParcelaTransaccion',
  UrlServicioGetVariedad: API_BASE + API_PATH + '/Variedad/GetVariedadesTransaccion'
};
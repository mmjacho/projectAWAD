const API_BASE = 'http://localhost:7011';
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
  UrlServicioGetVariedad: API_BASE + API_PATH + '/Variedad/GetVariedadesTransaccion',
  UrlServicioGetBitacora: API_BASE + API_PATH + '/Bitacora/GetBitacorasTransaccion',
  UrlServicioSetBitacora: API_BASE + API_PATH + '/Bitacora/SetBitacoraTransaccion',
  UrlServicioGetLabor: API_BASE + API_PATH + '/Labor/GetLaborTransaccion',
  UrlServicioGetPlaga: API_BASE + API_PATH + '/Plaga/GetPlagasTransaccion',
  UrlServicioGetLotes: API_BASE + API_PATH + '/Inventario/GetLotesTransaccion',
  UrlServicioSetLote: API_BASE + API_PATH + '/Inventario/SetLoteTransaccion', // Usa TRX_INSERT_COSECHA
  UrlServicioGetCalidades: API_BASE + API_PATH + '/Calidad/GetCalidadTransaccion',
  UrlServicioGetUnidades: API_BASE + API_PATH + '/Unidad/GetUnidadTransaccion',
  UrlServicioGetMovimientos: API_BASE + API_PATH + '/Inventario/GetMovimientosTransaccion',
  UrlServicioGetCliente: API_BASE + API_PATH + '/Cliente/GetClientesTransaccion',
  UrlServicioSetCliente: API_BASE + API_PATH + '/Cliente/SetClienteTransaccion',
  UrlServicioGetPedido: API_BASE + API_PATH + '/Pedido/GetPedidosTransaccion',
  UrlServicioSetPedido: API_BASE + API_PATH + '/Pedido/SetPedidoTransaccion',
};
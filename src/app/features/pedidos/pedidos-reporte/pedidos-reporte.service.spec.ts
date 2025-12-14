import { TestBed } from '@angular/core/testing';

import { PedidosReporteService } from './pedidos-reporte.service';

describe('PedidosReporteService', () => {
  let service: PedidosReporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidosReporteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

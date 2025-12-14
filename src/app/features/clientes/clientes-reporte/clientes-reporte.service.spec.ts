import { TestBed } from '@angular/core/testing';

import { ClientesReporteService } from './clientes-reporte.service';

describe('ClientesReporteService', () => {
  let service: ClientesReporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientesReporteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

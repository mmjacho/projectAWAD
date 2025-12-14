import { TestBed } from '@angular/core/testing';

import { InventarioReporteService } from './inventario-reporte.service';

describe('InventarioReporteService', () => {
  let service: InventarioReporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventarioReporteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

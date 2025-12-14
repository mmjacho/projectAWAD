import { TestBed } from '@angular/core/testing';

import { BitacorasReporteService } from './bitacoras-reporte.service';

describe('BitacorasReporteService', () => {
  let service: BitacorasReporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BitacorasReporteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

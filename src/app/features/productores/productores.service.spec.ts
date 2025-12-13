import { TestBed } from '@angular/core/testing';

import { ProductoresService } from './productores.service';

describe('ProductoresService', () => {
  let service: ProductoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

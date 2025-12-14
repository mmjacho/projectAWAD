import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitacorasReporte } from './bitacoras-reporte';

describe('BitacorasReporte', () => {
  let component: BitacorasReporte;
  let fixture: ComponentFixture<BitacorasReporte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BitacorasReporte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BitacorasReporte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

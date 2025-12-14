import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioReporte } from './inventario-reporte';

describe('InventarioReporte', () => {
  let component: InventarioReporte;
  let fixture: ComponentFixture<InventarioReporte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioReporte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioReporte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

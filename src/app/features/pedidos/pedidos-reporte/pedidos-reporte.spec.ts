import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosReporte } from './pedidos-reporte';

describe('PedidosReporte', () => {
  let component: PedidosReporte;
  let fixture: ComponentFixture<PedidosReporte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosReporte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosReporte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

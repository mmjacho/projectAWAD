import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesReporte } from './clientes-reporte';

describe('ClientesReporte', () => {
  let component: ClientesReporte;
  let fixture: ComponentFixture<ClientesReporte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesReporte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesReporte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

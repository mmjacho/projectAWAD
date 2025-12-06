import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Parcelas } from './parcelas';

describe('Parcelas', () => {
  let component: Parcelas;
  let fixture: ComponentFixture<Parcelas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Parcelas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Parcelas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

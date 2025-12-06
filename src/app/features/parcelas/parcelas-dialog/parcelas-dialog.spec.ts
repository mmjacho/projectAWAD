import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelasDialog } from './parcelas-dialog';

describe('ParcelasDialog', () => {
  let component: ParcelasDialog;
  let fixture: ComponentFixture<ParcelasDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelasDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelasDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

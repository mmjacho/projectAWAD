import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FincasDialog } from './fincas-dialog';

describe('FincasDialog', () => {
  let component: FincasDialog;
  let fixture: ComponentFixture<FincasDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FincasDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FincasDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

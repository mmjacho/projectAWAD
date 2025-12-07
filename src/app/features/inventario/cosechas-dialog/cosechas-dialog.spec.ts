import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosechasDialog } from './cosechas-dialog';

describe('CosechasDialog', () => {
  let component: CosechasDialog;
  let fixture: ComponentFixture<CosechasDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CosechasDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CosechasDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

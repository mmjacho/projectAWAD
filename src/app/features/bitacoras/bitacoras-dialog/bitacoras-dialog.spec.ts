import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitacorasDialog } from './bitacoras-dialog';

describe('BitacorasDialog', () => {
  let component: BitacorasDialog;
  let fixture: ComponentFixture<BitacorasDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BitacorasDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BitacorasDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoresDialog } from './productores-dialog';

describe('ProductoresDialog', () => {
  let component: ProductoresDialog;
  let fixture: ComponentFixture<ProductoresDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoresDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoresDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

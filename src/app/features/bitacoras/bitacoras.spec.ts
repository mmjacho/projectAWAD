import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bitacoras } from './bitacoras';

describe('Bitacoras', () => {
  let component: Bitacoras;
  let fixture: ComponentFixture<Bitacoras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bitacoras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bitacoras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

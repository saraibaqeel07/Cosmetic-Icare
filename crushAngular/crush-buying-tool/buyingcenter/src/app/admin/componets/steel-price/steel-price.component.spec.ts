import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteelPriceComponent } from './steel-price.component';

describe('SteelPriceComponent', () => {
  let component: SteelPriceComponent;
  let fixture: ComponentFixture<SteelPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SteelPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

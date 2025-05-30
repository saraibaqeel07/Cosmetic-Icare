import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotePriceComponent } from './quote-price.component';

describe('QuotePriceComponent', () => {
  let component: QuotePriceComponent;
  let fixture: ComponentFixture<QuotePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotePriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

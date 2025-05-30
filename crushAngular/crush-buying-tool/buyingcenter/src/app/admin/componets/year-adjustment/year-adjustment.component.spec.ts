import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearAdjustmentComponent } from './year-adjustment.component';

describe('YearAdjustmentComponent', () => {
  let component: YearAdjustmentComponent;
  let fixture: ComponentFixture<YearAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearAdjustmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

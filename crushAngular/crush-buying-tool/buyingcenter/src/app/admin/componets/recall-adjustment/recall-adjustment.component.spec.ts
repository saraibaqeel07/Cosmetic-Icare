import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecallAdjustmentComponent } from './recall-adjustment.component';

describe('RecallAdjustmentComponent', () => {
  let component: RecallAdjustmentComponent;
  let fixture: ComponentFixture<RecallAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecallAdjustmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecallAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

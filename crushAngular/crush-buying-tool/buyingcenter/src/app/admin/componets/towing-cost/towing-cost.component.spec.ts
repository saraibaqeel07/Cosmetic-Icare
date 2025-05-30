import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowingCostComponent } from './towing-cost.component';

describe('TowingCostComponent', () => {
  let component: TowingCostComponent;
  let fixture: ComponentFixture<TowingCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TowingCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TowingCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

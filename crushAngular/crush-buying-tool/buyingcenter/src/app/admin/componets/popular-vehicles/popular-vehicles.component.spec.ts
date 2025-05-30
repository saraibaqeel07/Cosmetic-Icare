import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularVehiclesComponent } from './popular-vehicles.component';

describe('PopularVehiclesComponent', () => {
  let component: PopularVehiclesComponent;
  let fixture: ComponentFixture<PopularVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopularVehiclesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

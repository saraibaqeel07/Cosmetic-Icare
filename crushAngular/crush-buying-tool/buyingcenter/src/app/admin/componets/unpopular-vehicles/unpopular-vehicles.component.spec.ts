import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpopularVehiclesComponent } from './unpopular-vehicles.component';

describe('UnpopularVehiclesComponent', () => {
  let component: UnpopularVehiclesComponent;
  let fixture: ComponentFixture<UnpopularVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnpopularVehiclesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpopularVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

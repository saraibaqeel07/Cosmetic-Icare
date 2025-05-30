import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetVendorComponent } from './set-vendor.component';

describe('SetVendorComponent', () => {
  let component: SetVendorComponent;
  let fixture: ComponentFixture<SetVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

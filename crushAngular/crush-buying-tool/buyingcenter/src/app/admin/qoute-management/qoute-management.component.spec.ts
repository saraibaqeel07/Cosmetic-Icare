import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QouteManagementComponent } from './qoute-management.component';

describe('QouteManagementComponent', () => {
  let component: QouteManagementComponent;
  let fixture: ComponentFixture<QouteManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QouteManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QouteManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

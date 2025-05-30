import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDriverComponent } from './set-driver.component';

describe('SetDriverComponent', () => {
  let component: SetDriverComponent;
  let fixture: ComponentFixture<SetDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetDriverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

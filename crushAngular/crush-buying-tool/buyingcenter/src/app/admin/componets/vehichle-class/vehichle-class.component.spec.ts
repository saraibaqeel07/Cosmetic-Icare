import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehichleClassComponent } from './vehichle-class.component';

describe('VehichleClassComponent', () => {
  let component: VehichleClassComponent;
  let fixture: ComponentFixture<VehichleClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehichleClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehichleClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

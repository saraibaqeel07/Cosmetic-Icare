import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomQuestionsAdminComponent } from './custom-questions-admin.component';

describe('CustomQuestionsAdminComponent', () => {
  let component: CustomQuestionsAdminComponent;
  let fixture: ComponentFixture<CustomQuestionsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomQuestionsAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomQuestionsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

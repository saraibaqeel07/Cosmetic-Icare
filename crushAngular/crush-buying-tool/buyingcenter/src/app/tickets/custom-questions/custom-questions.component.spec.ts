import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomQuestionsComponent } from './custom-questions.component';

describe('CustomQuestionsComponent', () => {
  let component: CustomQuestionsComponent;
  let fixture: ComponentFixture<CustomQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

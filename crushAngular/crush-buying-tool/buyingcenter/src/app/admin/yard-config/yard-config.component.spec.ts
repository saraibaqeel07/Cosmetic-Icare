import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YardConfigComponent } from './yard-config.component';

describe('YardConfigComponent', () => {
  let component: YardConfigComponent;
  let fixture: ComponentFixture<YardConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YardConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YardConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

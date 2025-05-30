import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleProofComponent } from './title-proof.component';

describe('TitleProofComponent', () => {
  let component: TitleProofComponent;
  let fixture: ComponentFixture<TitleProofComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitleProofComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleProofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppQuestionComponent } from './app-question.component';

describe('AppQuestionComponent', () => {
  let component: AppQuestionComponent;
  let fixture: ComponentFixture<AppQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppQuestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

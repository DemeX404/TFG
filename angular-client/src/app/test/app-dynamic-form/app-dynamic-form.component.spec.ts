import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDynamicFormComponent } from './app-dynamic-form.component';

describe('AppDynamicFormComponent', () => {
  let component: AppDynamicFormComponent;
  let fixture: ComponentFixture<AppDynamicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppDynamicFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

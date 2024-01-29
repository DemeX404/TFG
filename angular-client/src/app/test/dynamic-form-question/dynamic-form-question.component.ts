import {Component, Input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {QuestionBase} from '../question-base';
import { DynamicInput } from "../../shared/dynamic-form/fields/input/input.component";
@Component({
    standalone: true,
    selector: 'app-question',
    templateUrl: './dynamic-form-question.component.html',
    imports: [CommonModule, ReactiveFormsModule, DynamicInput]
})
export class DynamicFormQuestionComponent {
  @Input() question!: QuestionBase<string>;
  @Input() form!: FormGroup;

  ngOnInit(){
    console.log(this.question!)
  }
  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
}
import {Component, Input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {QuestionBase} from '../model/question-base';
import { DynamicInput } from "../fields/input/input.component";
@Component({
    standalone: true,
    selector: 'app-question',
    templateUrl: './dynamic-form-fields.component.html',
    styleUrl: './dynamic-form-fields.component.css',
    imports: [CommonModule, ReactiveFormsModule, DynamicInput]
})
export class DynamicFormQuestionComponent {
  @Input() question!: QuestionBase<string>;
  @Input() form!: FormGroup;

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
}
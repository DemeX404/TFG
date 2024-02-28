import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from './question-base';
@Injectable()
export class QuestionControlService {
  toCheckForm(questions: QuestionBase<string>[], values: any ) {
    const group: any = {};
    questions.forEach(question =>{
      question.value = values[question.key]
    })
    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
                                              : new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }
  toCreateForm(questions: QuestionBase<string>[] ) {
    const group: any = {};
    questions.forEach(question => {
      group[question.key] = new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }
}
import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DynamicFormQuestionComponent} from '../dynamic-form-fields/dynamic-form-fields.component';
import {QuestionBase} from '../model/question-base';
import {QuestionControlService} from '../model/question-control.service';
@Component({
  standalone: true,
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrl:'./dynamic-form.component.css',
  providers: [QuestionControlService],
  imports: [CommonModule, DynamicFormQuestionComponent, ReactiveFormsModule],
})
export class DynamicFormComponent implements OnInit {
  @Input() data: QuestionBase<string>[] | null = [];
  form!: FormGroup;
  payLoad = '';
  constructor(private qcs: QuestionControlService) {}
  ngOnInit() {
    this.form = this.qcs.toCreateForm(this.data as QuestionBase<string>[]);
  }
  onSubmit() {
    this.form = this.qcs.toCheckForm(this.data as QuestionBase<string>[], this.form.value);
    this.payLoad = JSON.stringify(this.form.value);
  }
}
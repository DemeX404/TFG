import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionBase } from '../../model/question-base';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'dynamic-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class DynamicInput {
  @Input({required: true}) values!:QuestionBase<string>;
  @Input() form!: FormGroup;

  ngOnInit(){
    console.log(this.values)
  }
}

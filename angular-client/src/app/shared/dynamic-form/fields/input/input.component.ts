import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionBase } from '../../model/question-base';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'dynamic-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class DynamicInput {
  @Input({required: true}) values!:QuestionBase<string>;
  @Input() form!: FormGroup;

  flagLabel: boolean = false;

  ngOnInit(){
    if(!this.values.value) this.values.value = '';
  }

  checkStatus(element:any){
    if(element.value.length > 0){
      this.flagLabel = true;
    } else{
      this.flagLabel = false;
    }
  }
}

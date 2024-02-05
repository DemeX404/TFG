import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicInput } from "../dynamic-form/fields/input/input.component";
import { DynamicFormComponent } from '../dynamic-form/form/dynamic-form.component';


import { Observable } from 'rxjs';
import { QuestionService } from '../../test/question.service';
import { QuestionBase } from '../dynamic-form/model/question-base';

@Component({
    selector: 'app-user-info',
    standalone: true,
    templateUrl: './user-info.component.html',
    styleUrl: './user-info.component.css',
    imports: [CommonModule, ReactiveFormsModule, DynamicInput, DynamicFormComponent],
    providers: [QuestionService]
})
export class UserInfoComponent {
  questions$: Observable<QuestionBase<any>[]>;
  
  constructor(service$: QuestionService) {
    this.questions$ = service$.getQuestions();
  }



  @Input() formList: any;
  profileForm = new FormGroup({
    icon: new FormControl(''),
    name: new FormControl(''),
    surname: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    phone: new FormControl('')
  });
  selectedImage:any;

  ngOnInit(){
    this.formList = [
      {field: 'input', value: 'test1', id: 'test1'},
      {field: 'input', value: 'test2', id: 'test3'}
    ]
  }

  renderForm(){
    this.formList.forEach((element:any) => {
      if (element.field == 'input') this.createInput(element)
    });
  }

  createInput(info:{field:string, value:string, id:string}){
    let input = DynamicInput;
    
  }

  onSubmit() {
    // Investigar que información es la que se tiene que pasar a mongodb
    console.log(this.profileForm.value)
  }

  openFile() {
    (document.querySelector('#icon') as HTMLInputElement).click();
  }

  loadImage(event: any) {
    console.log(event.target)
    let file = event.target.files[0];

    if (file) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

}

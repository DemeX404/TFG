import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionBase } from '../model/question-base';
import { DynamicInput } from "../fields/input/input.component";
import { IconComponent } from "../fields/icon/icon.component";
import { DropdownComponent } from "../fields/dropdown/dropdown.component";
import { InfoCountriesService } from '../../../services/info-countries/info-countries.service';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'fields-form',
  templateUrl: './dynamic-form-fields.component.html',
  styleUrl: './dynamic-form-fields.component.css',
  imports: [CommonModule, ReactiveFormsModule, DynamicInput, IconComponent, DropdownComponent]
})
export class DynamicFormQuestionComponent {
  @Input() question!: QuestionBase<string>;
  @Input() form!: FormGroup;

  @ViewChild('dropdown') dropdown!:ElementRef;

  arrayTest!:any;

  constructor(private myService:InfoCountriesService){}

  ngOnInit(){}

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }

  parsePhone(keydown: any) {
    if (keydown.key != 'Backspace') {
      let phone = this.form.controls['phone'].value;
      phone = phone.replaceAll('-', '')
      if (phone.length !== 0 && phone.length % 3 === 0) {
        this.form.controls['phone'].setValue(
          this.form.controls['phone'].value + '-'
        )
      }
    }
  }

  getCountries():void{
    // this.arrayTest =  this.myService.getCountries('https://restcountries.com/v3.1/region/europe?fields=name,idd');
    this.myService.getCountries('https://restcountries.com/v3.1/region/europe?fields=name,idd').subscribe({
      next: (data:any) => {
        this.arrayTest = data;
      },
      error: (error:any) => console.error(error)
    });
    
    console.log(this.dropdown.nativeElement)
  }
}
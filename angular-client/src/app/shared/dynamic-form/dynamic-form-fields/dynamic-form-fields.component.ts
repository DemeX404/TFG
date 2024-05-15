import { Component, Input } from '@angular/core';
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


  countries$!: Observable<any[]>;

  constructor(private myService: InfoCountriesService) { }


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
    if(!this.countries$){
      this.countries$ = this.myService.getCountries()
    }

  }


}
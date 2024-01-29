import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userInfo = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl('')
  })

  onSubmit() {
    // Investigar que información es la que se tiene que pasar a mongodb
    console.log(this.userInfo.value)
  }
}

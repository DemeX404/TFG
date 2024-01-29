import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '../../services/user-services/user-service.service';

@Component({
  selector: 'app-test',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})

export class TestComponent {
  constructor(private miServicio:UserServiceService) {}

  ngOninit(): void{}

  login(){
    console.log('Running init')
    this.miServicio.login()
  }
}

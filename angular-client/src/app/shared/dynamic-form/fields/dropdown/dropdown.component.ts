import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'dropdown-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {

  constructor(private http: HttpClient) { }

  // @Input() options: Array<any>[] = [];
  @Input() infOptions: any;
  @Input() label?: string;

  options: any

  ngOnInit() {

   
  }

}

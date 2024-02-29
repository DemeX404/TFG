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

  options: any

  ngOnInit() {

    this.http.get(this.infOptions).subscribe(
      response => {
        this.options = response
        this.options.sort((a: any, b: any) => {
          const nameA = a.name.common.toUpperCase(); // ignore upper and lowercase
          const nameB = b.name.common.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        })

        // for (let country of response as any[]){
        // }
      },
      error => console.log("Error: " + error)
    );
    console.log(this.options)
  }

  loadOptions() {
    if (this.options.length > 0) {
      console.log('bu')
    }
  }

}

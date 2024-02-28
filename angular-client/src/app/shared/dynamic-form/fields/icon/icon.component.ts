import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'profile-picture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class IconComponent {

  selectedImage: any;

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

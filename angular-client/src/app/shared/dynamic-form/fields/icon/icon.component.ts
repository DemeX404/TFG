import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'profile-picture',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class IconComponent {

  @Input() form!: FormGroup;

  selectedImage: any;

  openFile(icon: HTMLInputElement) {
    icon.click();
  }

  // loadImage(event: any) {
  //   let file = event.target.files[0];

  //   if (file) {
  //     let reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.selectedImage = e.target.result;
  //     };

  //     reader.readAsDataURL(file);

  //     this.form.patchValue({
  //       profilePicture: file as FileList
  //     })
  //     console.log('qqq')
  //   }
  // }

  loadImage(event: any) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files[0];

    if (file) this.saveFile(file);
  }

  saveFile(file: File) {
    const reader = new FileReader();

    reader.onloadend = () => {
      console.log(reader.result);

      this.selectedImage = reader.result as string;
      this.form.patchValue({
        profilePicture: reader.result as string
      });


    };
    reader.readAsDataURL(file);
  }
}

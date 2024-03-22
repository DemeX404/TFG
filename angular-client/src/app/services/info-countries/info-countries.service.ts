import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoCountriesService {

  constructor(private http: HttpClient) {}

  // getCountries(url:string){
  //   let options:any;
  //   this.http.get<any>(url).subscribe({
  //     next: (result) => {
  //       options = result
  //       options.sort((a: any, b: any) => {
  //         const nameA = a.name.common.toUpperCase(); // ignore upper and lowercase
  //         const nameB = b.name.common.toUpperCase(); // ignore upper and lowercase
  //         if (nameA < nameB) {
  //           return -1;
  //         }
  //         if (nameA > nameB) {
  //           return 1;
  //         }

  //         // names must be equal
  //         return 0;
  //       })
  //     },
  //     error: (error) => console.log("Error: " + error),
  //     complete: () => {}
  //   })
  // }
  getCountries(url:string):Observable<any>{
    return new Observable((observer) => {
      this.http.get<any>(url).subscribe({
        next: (result) => {
          const options = result;
          const sortedOptions = options.sort((a: any, b: any) => {
            const nameA = a.name.common.toUpperCase();
            const nameB = b.name.common.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          observer.next(sortedOptions); // Emit sorted options
          observer.complete(); // Complete the observable
        },
        error: (error) => console.error(error)
      });
    });
  }
}



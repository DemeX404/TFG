import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoCountriesService {
  URL: string = 'https://restcountries.com/v3.1/region/europe?fields=name,idd';

  constructor(private http: HttpClient) {}


  getCountries():Observable<any>{
    return new Observable((observer) => {
      this.http.get<any>(this.URL).subscribe({
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



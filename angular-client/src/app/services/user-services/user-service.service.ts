import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpClient) {}
  
  login(){
    console.log('Calling login')
     this.http.post('http://localhost:8090/e-order/sessions', {name:"a", password:"a"}).subscribe(
        response => console.log('Se han guardado los empleados: ' + response),
        error => console.log("Error: " + error)
     );
   }

  
}

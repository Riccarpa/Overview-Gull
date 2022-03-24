import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }
  
    token:any
    url = `http://80.211.57.191/api/users` 
    
    
    getUsers():Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    
    return this.http.get(this.url,{headers: headers});
  }

  retrieveUser(id:any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    return this.http.get(`${this.url}/${id}`,{headers: headers});
  }

  addUser(form:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body = {
     "name":form.name,
     "surname":form.surname,
     "email":form.email,
     "password":form.password,
     "cost":form.cost,
     "recruitment_date":form.recruitment_date,
     "week_working_hours":form.week_working_hours,
    };
    if (form.picture_data) {
      body['picture_data'] = form.picture_data;
       
    }
    return this.http.post(this.url, body,{headers: headers});
  }
  updateUser(form:any,id:any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body = {
      "name":form.name,
      "surname":form.surname,
      "role":form.role,
      "serial_number":form.serial_number,
      "email":form.email,
      "cost":form.cost,
      "recruitment_date":form.recruitment_date,
      "week_working_hours":form.week_working_hours,
     };
     if (form.picture_data) {
       body['picture_data'] = form.picture_data;
     }

     return this.http.patch(`${this.url}/${id}`, body,{headers: headers});
  }
  updateImage(picture:any,id:any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body = {
      "picture_data" : picture
     };
     return this.http.patch(`${this.url}/${id}`, body,{headers: headers});

  }
  deleteUser(id:any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    return this.http.delete(`${this.url}/${id}`,{headers: headers});
  }

  
}

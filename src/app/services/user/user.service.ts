import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectService } from '../project/project.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user:any//user dal login
  constructor(private http: HttpClient,private projectService:ProjectService,private router:Router) {}
  
    url = `${environment.apiURL}/users` 
  url2 = `${environment.apiURL}/user` 
    
    getUsers():Observable<any>{
   
    return this.http.get(this.url);
  }
// get progetti collaboratore(sezione users di postman)
  getUserProject(): Observable<any> {
    return this.http.get(`${this.url2}/projects`)
  }

  retrieveUser(id: any): Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }

  addUser(form:any): Observable<any> {
   
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
    return this.http.post(this.url, body);
  }
  updateUser(form:any,id:any){
   
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
     return this.http.patch(`${this.url}/${id}`, body);
  }
  updateImage(picture:any,id:any){
    
    let body = {
      "picture_data" : picture
     };
     return this.http.patch(`${this.url}/${id}`, body);
  }
  deleteUser(id:any){
    return this.http.delete(`${this.url}/${id}`);
  }
}

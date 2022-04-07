import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }
  
    token:any
    url = `${environment.apiURL}` 
    
    
    getMonthlyLogs(id:any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    return this.http.get(`${this.url}/users/${id}/monthlyLogs` ,{headers: headers});
  }

  createMonthlyLog(id:any,date:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body = {
     "user_id":id,
     "month":date
    };

    return this.http.post(`${this.url}/monthlyLogs`, body,{headers: headers});
  }

  patchActivities(id,arr): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body ={
      "daily_logs": [arr]
    }

    return this.http.patch(`${this.url}/monthlyLogs/${id}`, body,{headers: headers});
  }

 

}

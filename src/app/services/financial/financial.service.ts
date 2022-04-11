import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,Subject } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  constructor(private http: HttpClient) { }

  private subject = new Subject<any>();
  url = `${environment.apiURL}`

  getMonthlyLogs(id: any): Observable<any> {
    return this.http.get(`${this.url}/users/${id}/monthlyLogs`);
  }

  getUserMonthlyLogs(): Observable<any> {
    return this.http.get(`${this.url}/user/monthlyLogs`);
  }

  createMonthlyLog(id: any, date: any): Observable<any> {
    let body = {
      "user_id": id,
      "month": date
    };
    return this.http.post(`${this.url}/monthlyLogs`, body);
  }

  patchActivities(id, arr): Observable<any> {
    let body = {
      "daily_logs": arr
    }
    return this.http.patch(`${this.url}/monthlyLogs/${id}`, body);
  }

 sendClickEvent(){
   this.subject.next()
 }
 getClickEvent():Observable<any>{
   return this.subject.asObservable()
 }

}

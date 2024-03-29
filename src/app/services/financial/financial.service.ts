import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  constructor(private http: HttpClient) { }

  private subject = new Subject<any>();
  private addSubject = new Subject<any>();
  private selectAllDays = new Subject<any>();
  url = `${environment.apiURL}`;

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
    return this.http.post(`${this.url}/user/monthlyLogs`, body);
  }
  createMonthlyLogforAdmin(id: any, date: any): Observable<any> {
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
    return this.http.patch(`${this.url}/user/monthlyLogs/${id}`, body);
  }

  sendClickEvent() {
    this.subject.next()
  }

  getClickEvent(): Observable<any> {
    return this.subject.asObservable()
  }

  addClickEvent(days: Array<number>, formData: any) {
    let data = {
      days: days,
      activity: formData
    } 
    this.addSubject.next(data);
  }

  getAddClickEvent(): Observable<any> {
    return this.addSubject.asObservable()
  }

  selectAllDaysEvent(days: Array<number>) {
    this.selectAllDays.next(days);
  }

  getSelectAllDaysEvent(): Observable<any> {
    return this.selectAllDays.asObservable()
  }
}

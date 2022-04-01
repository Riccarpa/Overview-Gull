import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  token: any;
  url = environment.apiURL + '/tasks';

  getTasks(): Observable<any> {
    const url = this.url;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    })
    return this.http.get(url, { headers: headers });
  }

  addTask(name: string, assignee_id: number, status: number, start_date: Date, end_date: Date, effort: number, sprintId: number): Observable<any> {
    const url = this.url;

    let body = {
      "name": name,
      "assignee_id": assignee_id,
      "status": status,
      "start_date": start_date,
      "end_date": end_date,
      "effort": effort,
      "sprint_id": sprintId,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.post(url, body, { headers: headers });
  }
}

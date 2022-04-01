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
  currentTask: any;

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

  deleteTask(id: any): Observable<any> {
    const url = `${this.url}/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.delete(url, { headers: headers });
  }

  // retrieve task
  getTask(id: any): Observable<any> {
    const url = `${this.url}/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    })
    return this.http.get(url, { headers: headers });
  }

  // modifica task
  updateTask(name: string, assignee_id: number, status: number, start_date: Date, end_date: Date, effort: number): Observable<any> {
    const url = `${this.url}/${this.currentTask}`;

    let body = {
      "name": name,
      "assignee_id": assignee_id,
      "status": status,
      "start_date": start_date,
      "end_date": end_date,
      "effort": effort,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.patch(url, body, { headers: headers });
  }
}

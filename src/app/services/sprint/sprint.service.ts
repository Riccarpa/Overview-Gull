import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SprintService {

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  token: any;
  url = environment.apiURL + '/sprints';

  getSprints(): Observable<any> {
    const url = this.url;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    })
    return this.http.get(url, { headers: headers });
  }

  getSprint(id: any): Observable<any> {
    let url = `${this.url}/${id}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }

    return this.http.get(url, { headers });
  }

  addSprint(name: string, start_date: Date, end_date: Date, effort_days: number, revenue: number, projectId: number): Observable<any> {
    const url = this.url;

    let body = {
      "name": name,
      "start_date": start_date,
      "end_date": end_date,
      "effort_days": effort_days,
      "revenue": revenue,
      "project_id": projectId,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.post(url, body, { headers: headers });
  }
}

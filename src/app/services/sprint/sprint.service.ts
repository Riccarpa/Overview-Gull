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
  currentSprint: any;

  // recupera tutti gli sprint
  getSprints(): Observable<any> {
    const url = this.url;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    })
    return this.http.get(url, { headers: headers });
  }

  getUserSprint(id:number): Observable<any>{

    const url = environment.apiURL + `/projects/${id}/sprints`
    return this.http.get(url);
  
  }

  // retrive sprint
  getSprint(id: any): Observable<any> {
    let url = `${this.url}/${id}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }

    return this.http.get(url, { headers });
  }

  // aggiunge sprint
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

  // modifica sprint
  updateSprint(name: string, start_date: Date, end_date: Date, effort_days: number, revenue: number): Observable<any> {
    const url = `${this.url}/${this.currentSprint}`;

    let body = {
      "name": name,
      "start_date": start_date,
      "end_date": end_date,
      "effort_days": effort_days,
      "revenue": revenue,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.patch(url, body, { headers: headers });
  }

  // cancella sprint
  deleteSprint(id: any): Observable<any> {
    const url = `${this.url}/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.delete(url, { headers: headers });
  }
}

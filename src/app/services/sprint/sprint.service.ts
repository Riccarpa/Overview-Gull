import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  constructor(private http: HttpClient) { }

  url = environment.apiURL + '/sprints';

  // ritorna array di sprints progetto + task incorporati
  getUserSprint(id:number): Observable<any>{

    const url = environment.apiURL + `/projects/${id}/sprints`
    return this.http.get(url);
  }

  // aggiunge sprint
  addSprint(name: string, start_date: Date, end_date: Date, effort_days: number, revenue: number, projectId: number): Observable<any> {
    const url = this.url;

    let body = {
      "name": name,
      "start_date": start_date,
      "effort_days": effort_days | 0.1,
      "revenue": revenue | 0.1,
      "project_id": projectId,
    };
    if(end_date){
     body['end_date']=end_date
    }
    return this.http.post(url, body);
  }

  // modifica sprint
  updateSprint(name: string, start_date: Date, end_date: Date, effort_days: number, revenue: number,id:number): Observable<any> {
    const url = `${this.url}/${id}`;

    let body = {
      "name": name,
      "start_date": start_date,
      "end_date": end_date,
      "effort_days": effort_days | 0.1,
      "revenue": revenue | 0.1,
    };
    return this.http.patch(url, body);
  }

  // cancella sprint
  deleteSprint(id: any): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.delete(url);
  }
}

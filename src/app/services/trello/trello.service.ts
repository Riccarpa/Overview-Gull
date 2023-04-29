import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectService } from '../project/project.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TrelloService {

  constructor(private http: HttpClient) { }

  url = `${environment.apiURL}/users` 

  getUserTaskColumns(id : any): Observable<any> {
    return this.http.get(`${this.url}/${id}/tasks`)
  }

}

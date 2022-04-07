import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(private http:HttpClient) {
    this.token = localStorage.getItem('token');
   }
   token:any
   url = `${environment.apiURL}/activities` 


   getActivities():Observable<any>{
    
    return this.http.get(this.url);
}
}
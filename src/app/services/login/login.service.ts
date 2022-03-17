import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  baseUrl = 'http://80.211.57.191';

  checkLogin(user: string, pass: string): Observable<any> {
    let url = `${this.baseUrl}/api/login`;
    let body = {
      "email": user,
      "password": pass,
    };
    return this.http.post(url, body);
  }
}

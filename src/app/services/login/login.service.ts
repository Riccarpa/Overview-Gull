import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.apiURL + '/login';

  checkLogin(user: string, pass: string): Observable<any> {
    let url = this.baseUrl;
    let body = {
      "email": user,
      "password": pass,
    };
    return this.http.post(url, body);
  }
}

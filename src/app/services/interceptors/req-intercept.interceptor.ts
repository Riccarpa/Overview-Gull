import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({providedIn:'root'})
export class ReqInterceptInterceptor implements HttpInterceptor {

  
  constructor() {}

  takeRole(){
    const user = JSON.parse(localStorage.getItem('user'));
    return user
  }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
   
    
    return next.handle(request.clone({setHeaders:headers})).pipe(

      retry(3)
    )
  }
}

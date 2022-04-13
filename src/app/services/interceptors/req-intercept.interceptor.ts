import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, window } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';




@Injectable({providedIn:'root'})
export class ReqInterceptInterceptor implements HttpInterceptor {

  url = environment.apiURL + '/uploadImage'
  constructor(private router:Router,private route:ActivatedRoute) {}

  takeRole(){
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      return user
    }else{
     this.router.navigate(['/'])
    }
  }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    
    
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }

    const headerImg = {

      'Authorization': `Bearer ${token}`
    }
    
    if (request.url !== this.url) {
    return next.handle(request.clone({ setHeaders: headers })).pipe(

      // retry(3)
    )
    }else{
      
      return next.handle(request.clone({setHeaders:headerImg})).pipe(
  
        // retry(3)
      )
    }
   
    
  }
}

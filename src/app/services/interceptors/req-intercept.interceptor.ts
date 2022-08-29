import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, window } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';




@Injectable({providedIn:'root'})
export class ReqInterceptInterceptor implements HttpInterceptor {

  url = environment.apiURL + '/uploadImage'
  constructor(private router: Router, private route: ActivatedRoute,private toastr: ToastrService ) {}

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
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 403) {
          localStorage.clear();
          this.router.navigate(['login'])
        }else if(error.status === 401){
          this.toastr.warning('Non hai i permessi necessari per questa operazione', 'Warning', { timeOut: 3000, closeButton: true, progressBar: true });
        }
        return throwError(error)
      })
    )
    }else{
      return next.handle(request.clone({setHeaders:headerImg})).pipe(
      )
    }
  }
}

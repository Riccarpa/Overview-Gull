import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private loginService: LoginService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  loginForm = new FormGroup({
    user: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    this.loginService.checkLogin(this.loginForm.value.user, this.loginForm.value.password).subscribe((res) => {
      localStorage.setItem('token', res.data.token);
      this.router.navigate(['home/project']);
    },
      (error) => {
        this.error();
        this.router.navigate(['login']);
      }
    );
  }

  error() {
    this.toastr.error('Dati inseriti non validi', 'Acceso non riuscito', { timeOut: 3000 });
  }

}

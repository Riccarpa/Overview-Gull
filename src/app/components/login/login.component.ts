import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
  }

  loginForm = new FormGroup({
    user: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    this.loginService.checkLogin(this.loginForm.value.user, this.loginForm.value.password).subscribe((res) => {
      localStorage.setItem('token', res.data.token);
    });

  }

}

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';
import { ProjectService } from 'src/app/services/project/project.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private loginService: LoginService, private projectService: ProjectService) { }

  ngOnInit(): void {
  }

  loginForm = new FormGroup({
    user: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  disable = true;

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
    this.projectService.errorBar('Acceso non riuscito, dati non validi');
  }

  checkText() {
    this.disable = this.loginForm.value.user && this.loginForm.value.password ? false : true;
  }

}

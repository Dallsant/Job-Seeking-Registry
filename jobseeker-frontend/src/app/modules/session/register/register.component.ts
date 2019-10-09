import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    public  sessionService: SessionService,
    private router: Router
  ) { }

  login() {
    this.sessionService.login(this.loginForm.value).subscribe(data => {
      if (data.error === false){
        localStorage.setItem('token', data.data.token);
        this.alertService.success('Wellcome!');
        this.router.navigateByUrl('job-applications/list');
      }
      if (data.error === true){
        this.alertService.danger('Error: ' + data.message)
      }

    }, err => {
      this.alertService.danger('Error: ' + err.error.message);
    });
  }

  logout() {
    this.sessionService.login(this.loginForm.value).subscribe(data => {
      if (data.error === false){
        this.alertService.success('Bye bye');
        this.router.navigateByUrl('session/login');
        localStorage.clear();
      }
      if (data.error === true){
        this.alertService.danger('Error: ' + data.message)
      }

    }, err => {
      this.alertService.danger('Error: ' + err.error.message);
    });
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('edallsant', [Validators.required]),
      password: new FormControl('123456789', [Validators.required]),
    });

  }

}

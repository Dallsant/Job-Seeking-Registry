import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
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
  @Output() isLoggedIn = new EventEmitter<boolean>();
 
  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    public  sessionService: SessionService,
    private router: Router,
  ) {
   }

  login() {
    this.sessionService.login(this.loginForm.value).subscribe(data => {
      if (data.error === false){
        localStorage.setItem('token', data.data.token);
        this.alertService.success('Welcome!');
        this.sessionService.successfulLogin();
        this.router.navigateByUrl('job-applications/list');
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
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

  }

}

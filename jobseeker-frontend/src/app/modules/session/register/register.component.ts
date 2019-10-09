import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    public  sessionService: SessionService,
    private router: Router
  ) { }

  register() {
    this.sessionService.register(this.registerForm.value).subscribe(data => {
      if (data.error === false){
        this.alertService.success('Account Created!');
        this.router.navigateByUrl('session/login');
      }
      if (data.error === true){
        this.alertService.danger('Error: ' + data.message)
      }
    }, err => {
      this.alertService.danger('Error: ' + err.error.message);
    });
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

  }

}

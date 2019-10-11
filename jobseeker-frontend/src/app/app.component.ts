import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
// export const backend_url = '127.0.0.1:3000';
export const backend_url = 'http://127.0.0.1:3000';
import { SessionService } from './modules/session/session.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


export  let isLogged: Boolean = false;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  isLogged:boolean = false
  constructor(
    private httpClient: HttpClient,
    public sessionService: SessionService,
    private router: Router,
  ) {
  }

  title = 'Jobseeker';
  @ViewChild(MatMenuTrigger, { static: false }) menu: MatMenuTrigger;

  logout(): void {
    this.sessionService.logout();
    this.sessionService.succesfulLogOut();
    this.router.navigateByUrl('session/login');
    localStorage.clear();
  }

  verifyUserConnection(): void {
    if (localStorage.getItem('authentication') === null) {
      this.isLogged === false ;
    } else {
      this.isLogged === true;
    }
  }
 
  ngOnInit() {
    this.verifyUserConnection()
    this.sessionService.isLoggedIn.subscribe(logIn=>{
      this.isLogged = logIn;
    })
  }
}

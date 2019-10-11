import { backend_url } from './../../app.component';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private subject = new Subject<any>();
  subject$ = this.subject.asObservable();
  public userLogin = new BehaviorSubject<boolean>(false)
  isLoggedIn = this.userLogin.asObservable();

  constructor(
    private httpClient: HttpClient
  ) { }

  login(params: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post<any>(backend_url + '/login', JSON.stringify(params), httpOptions)
      .pipe();
  }

   successfulLogin(): void {
     this.userLogin.next(true);
   }

   succesfulLogOut(): void {
    this.userLogin.next(false);
   }

  register(params: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post<any>(backend_url + '/users', JSON.stringify(params), httpOptions)
      .pipe();
  }

  logout(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post<any>(backend_url + '/logout', '', httpOptions)
      .pipe();
  }

}

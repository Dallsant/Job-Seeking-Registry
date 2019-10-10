import { backend_url } from './../../app.component';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private subject = new Subject<any>();
  subject$ = this.subject.asObservable();

  constructor(
    private httpClient: HttpClient
  ) { }

  detectChanges(change:any) {
    this.subject.next(change);
  }

  login(params: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post<any>(backend_url + '/login', JSON.stringify(params), httpOptions)
      .pipe();
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
    return this.httpClient.post<any>(backend_url + '/out', '', httpOptions)
      .pipe();
  }

  // listUsers(): Observable<any> {
  //   return this.httpClient.get<any>(backend_url + '/users')
  //     .pipe();
  // }

}

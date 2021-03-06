import { backend_url } from './../../app.component';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {

  private subject = new Subject<any>();
  subject$ = this.subject.asObservable();

  constructor(
    private httpClient: HttpClient
  ) { }

  detectChanges(change:any) {
    this.subject.next(change)
  }

  add(params: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post<any>(backend_url + '/job-applications', JSON.stringify(params), httpOptions)
      .pipe();
  }

  list(): Observable<any> {
    return this.httpClient.get<any>(backend_url + '/job-applications')
      .pipe();
  }

  listCountries(): Observable<any> {
      return this.httpClient.get<any>(backend_url + '/locations')
      .pipe();
  }

  getStatusOptions(): Observable<any> {
    return this.httpClient.get<any>(backend_url + '/status-options')
    .pipe();
}

  getDetail(id:any): Observable<any> {
    return this.httpClient.get<any>(backend_url + '/job-applications/'+id)
      .pipe();
  }

  getReport(params:any) : Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post<any>(backend_url + `/report`, JSON.stringify(params), httpOptions)
    .pipe();
  }

  update(id:any, params: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.patch<any>(backend_url + '/job-applications/'+id, JSON.stringify(params), httpOptions)
      .pipe();
  }

  delete(id:any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    console.log(backend_url + '/job-applications/' + id)
    return this.httpClient.delete<any>(backend_url + '/job-applications/' + id, httpOptions).pipe();
  }

  transformTimestampsToDate(data:any){
    data.forEach(element => {
      if(typeof element.application_date === 'number') element.application_date = moment.unix(element.application_date).format('DD/MM/YYYY');
      if(typeof element.response_date === 'number') element.response_date = moment.unix(element.response_date).format('DD/MM/YYYY');
      // console.log(data.application_date)
    });
    return data;
  }
}

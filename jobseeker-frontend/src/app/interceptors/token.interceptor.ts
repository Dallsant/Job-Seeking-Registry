import { Injectable } from "@angular/core";
import { HttpRequest, HttpEvent, HttpHandler, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class SessionInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>, next: HttpHandler
  ) : Observable<HttpEvent<any>> {
    let loggedUser = localStorage.getItem('token');
    if (loggedUser) {
        request = request.clone({
            headers: request.headers.set(
              'authorization',
              loggedUser
            )
        });
      }
    return next.handle(request);
  }
}
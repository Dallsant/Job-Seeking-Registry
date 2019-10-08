import { Injectable } from "@angular/core";
import { HttpRequest, HttpEvent, HttpHandler, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class SessionInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>, next: HttpHandler
  ) : Observable<HttpEvent<any>> {
    // let loggedUser = localStorage.getItem('token');
    // if (loggedUser) {
        request = request.clone({
            headers: request.headers.set(
              'authorization',
              '07c3b0ce4ff0505e8f615af9ed766471f9743b71f0b74805e422e18275fb9b08'
              // loggedUser
            )
        });
      // }
    return next.handle(request);
  }
}
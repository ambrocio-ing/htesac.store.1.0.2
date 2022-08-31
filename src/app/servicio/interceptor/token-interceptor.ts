import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { catchError, concatMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private loginService: LoginService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {

        if (!this.loginService.isAuthenticated()) {
            return next.handle(req);
        }

        const token = this.loginService.token;
        let authreq = this.cloneRequest(req, token);
        //let authreq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });

        return next.handle(authreq).pipe(
            catchError((err: HttpErrorResponse) => {
                console.log("ERROR", err);
                if (err.status == 401) {
                    
                    return this.loginService.refreshToken(token).pipe(concatMap(data => {
                        this.loginService.setToken(data.token);
                        authreq = this.cloneRequest(req, data.token);                        
                        return next.handle(authreq);
                    }));
                    
                }
                else if (err.status == 403) {
                    Swal.fire({
                        icon:'warning',
                        title:'Acceso prohibido',
                        text:'No cuentas con permiso para completar la acción'
                    }).then(res => {
                        this.router.navigate(['/inicio']);
                    });
                    return throwError(err);
                }
                else{
                    return throwError(err);
                }
            })
        );
    }

    public cloneRequest(req:HttpRequest<any>, token:string) : HttpRequest<any> {
        return req.clone({headers : req.headers.set('Authorization', 'Bearer ' + token)});
    }
}

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import {HelperService} from '../helper/helper.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    alertService: any;
    constructor(private authService: AuthService,public helperService:HelperService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

       
        setTimeout(()=>{                           // <<<---using ()=> syntax
        this.helperService.globalloading=false;
       // console.log('here');
        }, 500);

        return next.handle(request).pipe(catchError(err => {
            console.log(err);


            const error = err.error.message || err.statusText;
            if(error){
                this.helperService.presentToast('error','Oops !',error);
            }
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authService.logout();
                this.helperService.storage_clear();
                 location.href="/";
            }
            return throwError(error);
        }))
    }
}

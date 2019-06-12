import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    private static readonly UnauthenticatedUrls = [
        '/api/auth/login',
        '/api/auth/liveness',
        '/api/auth/version'
    ];

    constructor(private authService: AuthService) {
        console.log('ctor interceptor');
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (AuthInterceptorService.UnauthenticatedUrls.some(url => req.url.startsWith(url))) {
            return next.handle(req);
        }

        console.log('auth request');
        // TODO: we must manage an isRefreshing flag or use the observable
        return next.handle(this.addToken(req)).pipe(
            catchError(error => {
                if (error.status !== 401) { throw error; }

                return this.authService.refresh().pipe(
                    switchMap(newToken => {
                        return next.handle(this.addToken(req));
                    })
                );
            })
        );
    }

    private addToken(req: HttpRequest<any>): HttpRequest<any> {
        return req.clone({
            setHeaders: {
                Authorization: 'Bearer ' + this.authService.getTokenValue()
            }
        });
    }
}

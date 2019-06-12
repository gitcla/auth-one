import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { catchError, switchMap, skip, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    // TODO: use constants
    private static readonly UnauthenticatedUrls = [
        '/api/auth/token/refresh', // token for this call should be injected by the interceptor
        '/api/auth/login',
        '/api/auth/liveness',
        '/api/auth/version'
    ];

    private isRefreshing = false;

    constructor(private authService: AuthService, private router: Router) {
        console.log('ctor interceptor');
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (AuthInterceptorService.UnauthenticatedUrls.some(url => req.url.startsWith(url))) {
            return next.handle(req);
        }

        console.log('intercept request', req.url);

        if (this.isRefreshing) {
            return this.nextOnNewToken(req, next);
        }

        return next.handle(this.addToken(req, this.authService.getTokenValue()))
            .pipe(
                catchError(error => {
                    if (error.status !== 401) { throw error; }

                    console.log('handling 401 for request', req.url);

                    if (this.isRefreshing) {
                        return this.nextOnNewToken(req, next);
                    }

                    this.isRefreshing = true;

                    return this.authService.refresh()
                        .pipe(
                            switchMap(newToken => {
                                console.log('token refresh handled successfully');

                                this.isRefreshing = false;

                                return next.handle(this.addToken(req, newToken));
                            }),
                            catchError(err => {
                                // if something goes wrong here we delete the token
                                console.log('error during token refresh');

                                this.authService.deleteToken();
                                this.isRefreshing = false;

                                this.router.navigate(['/login']);

                                throw err;
                            })
                        );
                })
            );
    }

    private nextOnNewToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('parallel call detected, wait for the new token on req', req.url);

        return this.authService.getToken()
            .pipe(
                skip(1),
                take(1),
                switchMap(newToken => {
                    if (newToken === null) {
                        console.log('no new token received, could not handle parallel call', req.url);
                        throw new Error('No new token received');
                    }

                    console.log('parallel call handled successfully', req.url);

                    return next.handle(this.addToken(req, newToken));
                })
            );
    }

    private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({
            setHeaders: {
                Authorization: 'Bearer ' + token
            }
        });
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

    private static readonly API_AUTH = '/api/auth';
    private static readonly AUTH_TOKEN_KEY = 'authToken';
    private static readonly TextResponse = 'text' as 'json'; // see: https://github.com/angular/angular/issues/18586

    private readonly tokenSubject = new BehaviorSubject<string>(window.localStorage.getItem(AuthService.AUTH_TOKEN_KEY));

    constructor(private http: HttpClient) { }

    isLoggedIn(): boolean {
        return this.getTokenValue() !== null;
    }

    getTokenValue(): string {
        return window.localStorage.getItem(AuthService.AUTH_TOKEN_KEY);
    }

    getToken(): Observable<string> {
        return this.tokenSubject.asObservable();
    }

    liveness(): Observable<string> {
        return this.http.get<string>(`${AuthService.API_AUTH}/liveness`, {
            responseType: AuthService.TextResponse
        });
    }

    version(): Observable<string> {
        return this.http.get<string>(`${AuthService.API_AUTH}/version`, {
            responseType: AuthService.TextResponse
        });
    }

    login(username: string, password: string): Observable<string> {
        return this.http.post<string>(`${AuthService.API_AUTH}/login`,
            { username, password },
            { responseType: AuthService.TextResponse })
            .pipe(
                tap(token => {
                    window.localStorage.setItem(AuthService.AUTH_TOKEN_KEY, token);
                    this.tokenSubject.next(token);
                    return token;
                })
            );
    }

    logout(): Observable<void> {
        return this.http.get<void>(`${AuthService.API_AUTH}/token/revoke`, {
            responseType: AuthService.TextResponse
        }).pipe(
            tap(_ => {
                window.localStorage.removeItem(AuthService.AUTH_TOKEN_KEY);
                this.tokenSubject.next(null);
            })
        );
    }

    refresh(): Observable<string> {
        return this.http.get<string>(`${AuthService.API_AUTH}/token/refresh`, {
            responseType: AuthService.TextResponse
        }).pipe(
            tap(token => {
                window.localStorage.setItem(AuthService.AUTH_TOKEN_KEY, token);
                this.tokenSubject.next(token);
            })
        );
    }
}

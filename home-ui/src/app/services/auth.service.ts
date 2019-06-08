import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

    private static API_AUTH = '/api/auth';
    private static TextResponse = 'text' as 'json'; // see: https://github.com/angular/angular/issues/18586

    constructor(private http: HttpClient) { }

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
}

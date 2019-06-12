import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from '../models/user-data';

@Injectable()
export class WhoamiService {

    private static readonly API_WHOAMI = '/api/whoami';

    constructor(private http: HttpClient) { }

    whoami(): Observable<UserData> {
        return this.http.get<UserData>(`${WhoamiService.API_WHOAMI}/`);
    }
}

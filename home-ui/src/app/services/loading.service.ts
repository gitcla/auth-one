import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LoadingService {

    private readonly loadingSubject = new BehaviorSubject<boolean>(false);

    public isLoading(): Observable<boolean> {
        return this.loadingSubject.asObservable();
    }

    public setState(value: boolean): void {
        this.loadingSubject.next(value);
    }
}

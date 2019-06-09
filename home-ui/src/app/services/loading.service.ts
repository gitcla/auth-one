import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingService {

    private readonly loadingSubject = new BehaviorSubject<boolean>(false);
    private readonly spinningSubject = new BehaviorSubject<boolean>(false);

    private timerSubcription = Subscription.EMPTY;
    private isDelayed = false;

    isLoading(): Observable<boolean> {
        return this.loadingSubject.asObservable();
    }

    isSpinning(): Observable<boolean> {
        return this.spinningSubject.asObservable();
    }

    startLoading(): void {
        if (this.spinningSubject.getValue() === false) {
            this.timerSubcription.unsubscribe();
            this.isDelayed = true;
            this.timerSubcription = timer(1500)
                .subscribe(_ => {
                    this.isDelayed = false;
                    if (this.loadingSubject.getValue() === false) {
                        this.spinningSubject.next(false);
                    }
                });
        }
        this.loadingSubject.next(true);
        this.spinningSubject.next(true);
    }

    stopLoading(): void {
        this.loadingSubject.next(false);
        if (this.isDelayed === false) {
            this.spinningSubject.next(false);
        }
    }

    load<T>(obs$: Observable<T>): Observable<T> {
        this.startLoading();
        return obs$.pipe(
            finalize(() => this.stopLoading())
        );
    }
}

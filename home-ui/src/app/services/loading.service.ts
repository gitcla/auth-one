import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
    readonly loadingState = {
        isLoading: false
    };
}

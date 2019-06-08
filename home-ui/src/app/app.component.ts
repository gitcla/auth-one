import { Component } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    isLoading: Observable<boolean>;

    constructor(loadingService: LoadingService) {
        this.isLoading = loadingService.isLoading();
    }
}

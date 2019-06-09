import { Component } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    isSpinning: Observable<boolean>;

    constructor(loadingService: LoadingService) {
        this.isSpinning = loadingService.isSpinning();
    }
}

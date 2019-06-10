import { Component } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {

    isSpinning: Observable<boolean>;

    constructor(loadingService: LoadingService) {
        this.isSpinning = loadingService.isSpinning();
    }
}

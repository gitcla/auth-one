import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    result = 'click the button';

    constructor(private authService: AuthService, private loadingService: LoadingService) { }

    check(): void {
        this.loadingService.loadingState.isLoading = true;
        this.authService.liveness().subscribe(result => {
            this.result = result;
            this.loadingService.loadingState.isLoading = false;
        }, err => {
            console.log('error');
            console.log(err);
            this.loadingService.loadingState.isLoading = false;
        });
    }
}

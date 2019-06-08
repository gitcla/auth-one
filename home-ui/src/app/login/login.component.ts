import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    result = 'click the button';
    apiVersion = '';

    constructor(private authService: AuthService, private loadingService: LoadingService) { }

    ngOnInit(): void {
        this.authService.version().subscribe(version => {
            this.apiVersion = version;
        }, err => {
            console.error(err);
        });
    }

    check(): void {
        this.loadingService.setState(true);
        this.authService.liveness()
            .pipe(
                finalize(() => this.loadingService.setState(false))
            ).subscribe(result => {
                this.result = result;
            }, err => {
                console.error(err);
            });
    }
}

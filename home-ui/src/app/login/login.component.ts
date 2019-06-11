import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    apiVersion = '';
    username = '';
    password = '';
    hidePassword = true;
    isLoading: Observable<boolean>;

    constructor(
        private authService: AuthService,
        private loadingService: LoadingService,
        private router: Router,
        private snackBar: MatSnackBar) {
        this.isLoading = loadingService.isLoading();
    }

    ngOnInit(): void {
        this.authService.version().subscribe(version => {
            this.apiVersion = version;
        }, err => {
            console.error(err);
            this.snackBar.open('Could not determine API version', 'OK', {
                duration: 3000
            });
        });
    }

    login(): void {
        this.loadingService.load(this.authService.login(this.username, this.password))
            .subscribe(_ => {
                this.router.navigate(['/home']);
            }, err => {
                console.log(err);
                this.snackBar.open('Login failed', 'OK', {
                    duration: 2000
                });
            });
    }

    canLogin(): boolean {
        return this.username !== '' && this.password !== '' && !this.loadingService.isSpinningState();
    }
}

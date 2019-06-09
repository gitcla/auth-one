import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';

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
        private snackBar: MatSnackBar) {
        this.isLoading = loadingService.isLoading();
    }

    ngOnInit(): void {
        this.authService.version().subscribe(version => {
            this.apiVersion = version;
        }, err => {
            console.error(err);
        });
    }

    login(): void {
        this.loadingService.load(this.authService.liveness())
            .subscribe(result => {
                this.snackBar.open('Response: ' + result, 'OK', {
                    duration: 2000
                });
            }, err => {
                console.log(err);
            });
    }

    canLogin(): boolean {
        return this.username !== '' && this.password !== '' && !this.loadingService.isSpinningState();
    }
}

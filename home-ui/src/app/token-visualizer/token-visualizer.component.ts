import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { WhoamiService } from '../services/whoami.service';
import { MatSnackBar } from '@angular/material';
import { LoadingService } from '../services/loading.service';
import { Router } from '@angular/router';
import { UserData } from '../models/user-data';

@Component({
    selector: 'app-token-visualizer',
    templateUrl: './token-visualizer.component.html',
    styleUrls: ['./token-visualizer.component.scss']
})
export class TokenVisualizerComponent implements OnInit {

    token = '';
    userData: UserData;

    constructor(
        private authService: AuthService,
        private whoamiService: WhoamiService,
        private loadingService: LoadingService,
        private router: Router,
        private snackBar: MatSnackBar) { }

    ngOnInit() {
        this.reload();
    }

    reload(): void {
        this.loadingService.load(this.whoamiService.whoami())
            .subscribe(userData => {
                this.userData = userData;
                this.token = this.formatToken(this.authService.getTokenValue());
            }, err => {
                console.error(err);
                this.snackBar.open('Error calling whoami service', 'OK', {
                    duration: 3000
                });
            });
    }

    logout(): void {
        this.authService.logout()
            .subscribe(_ => {
                this.router.navigate(['/login']);
            }, err => {
                console.error(err);
                this.snackBar.open('Error during logout', 'OK', {
                    duration: 3000
                });
            });
    }

    revokeAll(): void {
        this.authService.revokeAll()
            .subscribe(_ => {
                this.router.navigate(['/login']);
            }, err => {
                console.error(err);
                this.snackBar.open('Error during revokeAll', 'OK', {
                    duration: 3000
                });
            });
    }

    private formatToken(token: string): string {
        const parts: string[] = [];
        let pos = 0;
        const chars = 60;
        while (pos < token.length) {
            parts.push(token.substr(pos, chars));
            pos = pos + chars;
        }
        return parts.join('\n');
    }
}

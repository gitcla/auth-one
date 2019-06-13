import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserData } from '../models/user-data';
import { WhoamiService } from '../services/whoami.service';

@Component({
    selector: 'app-user-details-dialog',
    templateUrl: './user-details-dialog.component.html',
    styleUrls: ['./user-details-dialog.component.scss']
})
export class UserDetailsDialogComponent implements OnInit {

    userData: UserData;

    constructor(
        public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
        private authService: AuthService,
        private whoamiService: WhoamiService,
        private router: Router,
        private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.whoamiService.whoami()
            .subscribe(userData => {
                this.userData = userData;
            });
    }

    logout(): void {
        this.authService.logout()
            .subscribe(_ => {
                this.dialogRef.close();
                this.router.navigate(['/login']);
            }, err => {
                console.error(err);
                this.snackBar.open('Error during logout', 'OK', {
                    duration: 3000
                });
            });
    }
}

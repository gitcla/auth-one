import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailsDialogComponent } from './user-details-dialog.component';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-main-toolbar',
    templateUrl: './main-toolbar.component.html',
    styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {

    isLoggedIn: Observable<boolean>;

    constructor(private dialog: MatDialog, private authService: AuthService) { }

    ngOnInit() {
        this.isLoggedIn = this.authService.getToken().pipe(
            map(token => {
                return token !== null;
            })
        );
    }

    openUserDetailsDialog(): void {
        this.dialog.open(UserDetailsDialogComponent, {
            width: '360px', position: { top: '72px', right: '12px' }
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailsDialogComponent } from './user-details-dialog.component';

@Component({
    selector: 'app-main-toolbar',
    templateUrl: './main-toolbar.component.html',
    styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {

    constructor(public dialog: MatDialog) { }

    ngOnInit() { }

    openUserDetailsDialog(): void {
        this.dialog.open(UserDetailsDialogComponent, {
            width: '360px', position: { top: '72px', right: '12px' }
        });
    }
}

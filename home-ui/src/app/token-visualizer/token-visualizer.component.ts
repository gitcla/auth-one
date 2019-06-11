import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-token-visualizer',
    templateUrl: './token-visualizer.component.html',
    styleUrls: ['./token-visualizer.component.scss']
})
export class TokenVisualizerComponent implements OnInit {

    token = '';

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.token = this.formatToken(this.authService.getToken());
    }

    reload(): void {
    }

    logout(): void {
    }

    revokeAll(): void {
    }

    private formatToken(token: string): string {
        const parts: string[] = [];
        let pos = 0;
        const chars = 80;
        while (pos < token.length) {
            parts.push(token.substr(pos, 80));
            pos = pos + chars;
        }
        return parts.join('\n');
    }
}

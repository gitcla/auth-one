import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';

@NgModule({
    declarations: [
        LoginComponent,
        AppComponent
    ],
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,

        // Material
        MatToolbarModule,
        MatProgressBarModule,
        MatCardModule,
        MatButtonModule,

        AppRoutingModule
    ],
    providers: [
        AuthService,
        LoadingService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';
import { HomeComponent } from './home/home.component';
import { TokenVisualizerComponent } from './token-visualizer/token-visualizer.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { AuthGuard } from './guards/auth-guard.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { WhoamiService } from './services/whoami.service';
import { UserDetailsDialogComponent } from './main-toolbar/user-details-dialog.component';

@NgModule({
    declarations: [
        LoginComponent,
        HomeComponent,
        TokenVisualizerComponent,
        ProgressBarComponent,
        ErrorPageComponent,
        MainToolbarComponent,
        UserDetailsDialogComponent,
        AppComponent
    ],
    entryComponents: [
        UserDetailsDialogComponent
    ],
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,

        // Material
        MatToolbarModule,
        MatProgressBarModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatDialogModule,

        AppRoutingModule
    ],
    providers: [
        AuthService,
        LoadingService,
        AuthGuard,
        WhoamiService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

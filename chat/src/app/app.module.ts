import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';
import { FormsModule }    from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login.component';

import { AlertComponent } from './alert.component';
import { AuthenticationService } from './auth/auth.service';
import { AlertService } from './alert.service';
import { AuthGuard } from './auth/auth_guard';

import { ChatComponent } from './chat/chat.component'
import { ChatService } from './chat/chat.service'
import { WebsocketService } from './chat/websocket.service'

import { routing } from './app.routing';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    routing
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    AlertComponent
  ],
  providers: [
    CookieService,
    AuthenticationService,
    AuthGuard,
    AlertService,
    ChatService,
    WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

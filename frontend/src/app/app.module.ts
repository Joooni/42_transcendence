import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';
import { ChatComponent } from './chat/chat.component';
import { ChatDirectMessageComponent } from './chat/chat-direct-message/chat-direct-message.component';
import { ChatChannelComponent } from './chat/chat-channel/chat-channel.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ProfileComponent,
    SettingsComponent,
    MatchmakingComponent,
    ChatComponent,
    ChatDirectMessageComponent,
    ChatChannelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }

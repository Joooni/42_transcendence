import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ChatComponent } from './chat/chat.component';
import { ChatDirectMessageComponent } from './chat/chat-direct-message/chat-direct-message.component';
import { ChatChannelComponent } from './chat/chat-channel/chat-channel.component';import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';
import { GameDisplayComponent } from './game/game-display/game-display.component';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ErrorComponent } from './error/error.component';
import { ChatChannelDropdownComponent } from './chat/chat-channel/chat-channel-dropdown/chat-channel-dropdown.component';
import { ChatDropdownComponent } from './chat/chat-dropdown/chat-dropdown.component';
import { GameWatchComponent } from './game/game-watch/game-watch.component';
import { GameInviteComponent } from './game-invite/game-invite.component';
import { AlreadyConnectedComponent } from './already-connected/already-connected.component';
import { GameSearchComponent } from './game/game-search/game-search.component';
import { NotificationComponent } from './notification/notification.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

const config: SocketIoConfig = { url: `http://${environment.DOMAIN}:3000`, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ProfileComponent,
    SettingsComponent,
    LoginComponent,
    ChatComponent,
		ChatDropdownComponent,
    ChatDirectMessageComponent,
    ChatChannelComponent,
    ChatChannelDropdownComponent,
    GameComponent,
    GameDisplayComponent,
    ErrorComponent,
    GameWatchComponent,
    GameInviteComponent,
    AlreadyConnectedComponent,
    GameSearchComponent,
    NotificationComponent,
    LeaderboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ApolloModule,
    JwtModule.forRoot({
      config: {
        allowedDomains: [`${environment.DOMAIN}:3000`]
      }
    }),
    SocketIoModule.forRoot(config),
		ReactiveFormsModule
  ],
  providers: [
    CookieService,
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: `http://${environment.DOMAIN}:3000/graphql`,
          }),
        };
      },
      deps: [HttpLink],
    },
    ChatComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

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
import { MatchmakingComponent } from './matchmaking/matchmaking.component';
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

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ProfileComponent,
    SettingsComponent,
    MatchmakingComponent,
    LoginComponent,
    ChatComponent,
    ChatDirectMessageComponent,
    ChatChannelComponent,
    GameComponent,
    GameDisplayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ApolloModule,
    JwtModule.forRoot({
      config: {
        allowedDomains: ['localhost:3000']
      }
    }),
    SocketIoModule.forRoot(config),
  ],
  providers: [
    CookieService,
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:3000/graphql',
          }),
        };
      },
      deps: [HttpLink],
    },
    ChatComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

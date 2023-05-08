import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
// import { HeroesComponent } from './heroes/heroes.component';

// import { FormsModule } from '@angular/forms';
// import { HeroDetailComponent } from './hero-detail/hero-detail.component';
// import { MessagesComponent } from './messages/messages.component';
// import { AppRoutingModule } from './app-routing.module';
// import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    // HeaderComponent,
    // HeroesComponent,
    // HeroDetailComponent,
    // MessagesComponent,
    // DashboardComponent //gets automatically added when ng create component is called
  ],
  imports: [
    BrowserModule,
    // FormsModule,
    // AppRoutingModule,
	HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

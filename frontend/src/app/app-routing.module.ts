import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './login.guard';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [LoginGuard()] },
  { path: 'profile/:username', component: ProfileComponent, canActivate: [LoginGuard()] },
  { path: 'settings', component: SettingsComponent, canActivate: [LoginGuard()] },
  { path: 'chat', component: ChatComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full'}
];

 // can we check here if the user is logged in and if he is not, only allow him to access the home/login route? f.e. in form of a guard?

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

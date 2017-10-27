import { Routes, RouterModule, CanActivate } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { AuthGuard } from './auth/auth_guard';
import { ChatComponent } from './chat/chat.component';

const appRoutes: Routes = [
  {path: '', component: ChatComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},

  { path: '**', redirectTo: '/' }
];

export const routing = RouterModule.forRoot(appRoutes);

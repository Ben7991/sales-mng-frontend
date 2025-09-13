import { Routes } from '@angular/router';
import {LoginComponent} from '../pages/auth/login/login.component';
import {ForgetPasswordComponent} from '../pages/auth/forget-password/forget-password.component';
import {ChangePasswordComponent} from '../pages/auth/change-password/change-password.component';

export const routes: Routes = [
  {path:'login',
   component : LoginComponent,
  },
  {
    path:'forgot-password',
    component: ForgetPasswordComponent

  },
  {
    path:'reset-password',
    component: ChangePasswordComponent
  }
];

import { Routes } from "@angular/router";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";
import { ForgetPasswordComponent } from "./components/forget-password/forget-password.component";
import { LoginComponent } from "./components/login/login.component";

export const authRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'reset-password',
        component: ChangePasswordComponent
    },
    {
        path: 'forgot-password',
        component: ForgetPasswordComponent
    },
]

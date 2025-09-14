import { User } from "@shared/models/interface";

export interface LoginForm {
    usernameOrEmail: string,
    password: string,
    rememberMe: boolean
}

export interface LoginResponse {
    data: {
        user: User,
        accessToken: string;
    }
}

export interface PasswordResetForm {
    newPassword: string,
    confirmPassword: string,
}

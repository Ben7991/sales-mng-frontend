import { UserRole, UserAccountStatus } from "@shared/models/types";

export interface LoginForm {
    usernameOrEmail: string,
    password: string,
    rememberMe: boolean
}

export interface LoginResponse {
    data: {
        user: {
            id: string;
            createdAt: string;
            updatedAt: string;
            name: string;
            username: string;
            email: string;
            status: UserAccountStatus,
            role: UserRole
        },
        accessToken: string;
    }
}

export interface PasswordResetForm {
    newPassword: string,
    confirmPassword: string,
}

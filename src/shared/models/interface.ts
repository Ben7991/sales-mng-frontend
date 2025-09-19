import { UserAccountStatus, UserRole } from "./types";

export interface UserResponse {
    data: User;
}
export interface userArrayResponse {
    data: {
        users: User[];
        count: number;
        total?: number;
        currentPage?: number
    };
}

export interface User {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    username: string;
    email: string;
    status: UserAccountStatus,
    role: UserRole
}

export interface UserApiParams {
  perPage?: string | number;
  page?: string | number;
  q?: string;
}

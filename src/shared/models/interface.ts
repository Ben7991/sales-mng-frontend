import { UserAccountStatus, UserRole } from "./types";

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

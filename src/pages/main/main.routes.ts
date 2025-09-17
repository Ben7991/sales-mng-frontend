import { Routes } from "@angular/router";
import { SuppliersComponent } from "pages/suppliers/suppliers.component";
import { UserManagementComponent } from "pages/user-management/user-management.component";

export const mainRoutePaths: Routes = [
    {
        path: 'user-management',
        component: UserManagementComponent
    },
    {
        path: 'suppliers',
        component: SuppliersComponent
    }
];

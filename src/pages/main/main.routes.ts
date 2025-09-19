import { Routes } from "@angular/router";
import { SupplierManagementComponent } from "pages/suppliers/supplier-management.component";
import { UserManagementComponent } from "pages/user-management/user-management.component";

export const mainRoutePaths: Routes = [
    {
        path: 'user-management',
        component: UserManagementComponent
    },
    {
        path: 'suppliers',
        component: SupplierManagementComponent
    }
];

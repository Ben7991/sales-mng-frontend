import { Routes } from "@angular/router";
import { SupplierManagementComponent } from "pages/suppliers/supplier-management.component";
import { UserManagementComponent } from "pages/user-management/user-management.component";
import { SettingsComponent } from '../settings/settings.component';

export const mainRoutePaths: Routes = [
  {
    path: 'user-management',
    component: UserManagementComponent
  },
  {
    path: 'suppliers',
    component: SupplierManagementComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  }
];

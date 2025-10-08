import { Routes } from "@angular/router";
import { SupplierManagementComponent } from "pages/suppliers/supplier-management.component";
import { UserManagementComponent } from "pages/user-management/user-management.component";
import { SettingsComponent } from '../settings/settings.component';
import { InventoryManagementComponent } from "pages/inventory-management/inventory-management.component";

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
    path: 'inventory',
    component: InventoryManagementComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent
  }
];

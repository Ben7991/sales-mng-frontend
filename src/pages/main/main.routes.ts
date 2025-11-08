import { Routes } from "@angular/router";
import { SupplierManagementComponent } from "pages/suppliers/supplier-management.component";
import { UserManagementComponent } from "pages/user-management/user-management.component";
import { SettingsComponent } from '../settings/settings.component';
import { InventoryManagementComponent } from "pages/inventory-management/inventory-management.component";
import { CustomersComponent } from "pages/customers/customers.component";
import {DashboardComponent} from '../dashboard/dashboard.component';
import {SalesMgtComponent} from '../sales-mgt/sales-mgt.component';
import {SalesManagementComponent} from '../sales-mgt/components/sales-management/sales-management.component';
import {ArrearsComponent} from '../sales-mgt/components/arrears/arrears.component';

export const mainRoutePaths: Routes = [
  {
    path:'dashboard',
    component:DashboardComponent
  },
  {
    path: 'user-management',
    component: UserManagementComponent
  },
  {
    path: 'suppliers',
    component: SupplierManagementComponent
  },
  {
    path: 'customers',
    component: CustomersComponent,
  },
   {
    path: 'inventory',
    component: InventoryManagementComponent,
  },
  {
    path: 'sales-management',
    component: SalesMgtComponent,
    children: [
      { path: 'orders', component: SalesManagementComponent },
      { path: 'arrears', component: ArrearsComponent },
      { path: '', redirectTo: 'orders', pathMatch: 'full' }
    ]
  },
  {
    path: 'settings',
    component: SettingsComponent
  }
];

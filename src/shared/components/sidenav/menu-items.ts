import { signal } from '@angular/core';
import { NAVIGATION_ROUTES } from '@shared/constants/navigation.constant';
import { MenuItem } from '@shared/components/sidenav/sidenav.interface';
import { Page } from '@shared/models/enums';

export const menuItems: MenuItem[] = [
  { 
    name: 'Dashboard', 
    icon: 'assets/dashboardIcon.svg', 
    route: NAVIGATION_ROUTES.DASHBOARD.HOME, 
    active: false,
    feature: Page.DASHBOARD
  },
  { 
    name: 'Suppliers', 
    icon: 'assets/suppliersIcon.svg', 
    route: NAVIGATION_ROUTES.SUPPLIERS.HOME, 
    active: false, 
    feature: Page.SUPPLIERS
  },
  { 
    name: 'Users', 
    icon: 'assets/usersIcon.svg', 
    route: NAVIGATION_ROUTES.USERS.HOME, 
    active: false, 
    feature: Page.USERS
  },
  { 
    name: 'Customers', 
    icon: 'assets/customerIcon.svg', 
    route: NAVIGATION_ROUTES.CUSTOMERS.HOME, 
    active: false, 
    feature: Page.CUSTOMERS
  },
  { 
    name: 'Inventory', 
    icon: 'assets/inventoryIcon.svg', 
    route: NAVIGATION_ROUTES.INVENTORY.HOME, 
    active: false, 
    feature: Page.INVENTORY
  },
  { 
    name: 'Sales', 
    icon: 'assets/salesIcon.svg', 
    route: NAVIGATION_ROUTES.SALES.HOME, 
    active: false, 
    feature: Page.SALES
  },
  { 
    name: 'Reports', 
    icon: 'assets/reportsIcon.svg', 
    route: NAVIGATION_ROUTES.REPORTS.HOME, 
    active: false, 
    feature: Page.REPORTS
  },
  { 
    name: 'Settings', 
    icon: 'assets/settingsIcon.svg', 
    route: NAVIGATION_ROUTES.SETTINGS.HOME, 
    active: false, 
  },
];

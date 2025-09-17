import { signal } from '@angular/core';
import { NAVIGATION_ROUTES } from '@shared/constants/navigation.constant';
import {MenuItem} from '@shared/components/sidenav/sidenav.interface';

export const menuItems = signal<MenuItem[]>([
  { name: 'Dashboard', icon: 'assets/dashboardIcon.svg', route: NAVIGATION_ROUTES.DASHBOARD.HOME, active: true },
  { name: 'Suppliers', icon: 'assets/suppliersIcon.svg', route: NAVIGATION_ROUTES.DASHBOARD.SUPPLIERS, active: false },
  { name: 'Reports', icon: 'assets/reportsIcon.svg', route: NAVIGATION_ROUTES.DASHBOARD.HOME, active: false },
  { name: 'Users', icon: 'assets/usersIcon.svg', route: NAVIGATION_ROUTES.DASHBOARD.USERS, active: false },
  { name: 'Settings', icon: 'assets/settingsIcon.svg', route: NAVIGATION_ROUTES.DASHBOARD.HOME, active: false }
]);

import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';

interface MenuItem {
  name: string;
  icon: string;
  active?: boolean;
  route: string;
}

@Component({
  selector: 'app-sidenav',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent {
  @Input() isCollapsed: boolean = false;
  @Input() isMobileOpen: boolean = false;

  // Inject Router service
  private router = inject(Router);

  menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      icon: `assets/dashboardIcon.svg`,
      route: '/dashboard',
      active: true
    },
    {
      name: 'Suppliers',
      icon: `assets/suppliersIcon.svg`,
      route: '/suppliers'
    },
    {
      name: 'Reports',
      icon: `assets/reportsIcon.svg`,
      route: '/reports'
    },
    {
      name: 'Users',
      icon: `assets/usersIcon.svg`,
      route: '/users'
    },
    {
      name: 'Settings',
      icon: `assets/settingsIcon.svg`,
      route: '/settings'
    }
  ];

  selectMenuItem(item: MenuItem) {
    // Reset all items to inactive
    this.menuItems.forEach(menuItem => menuItem.active = false);

    // Set selected item as active
    item.active = true;

    // Close mobile menu
    this.closeMobile();

    // Navigate to the route
    this.router.navigate([item.route]);

    console.log('Navigate to:', item.route);
  }

  closeMobile() {
    this.isMobileOpen = false;
  }
}

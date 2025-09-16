import {computed, effect, inject, Injectable, signal} from '@angular/core';
import { Router } from '@angular/router';
import {MenuItem} from '@shared/models/sidenav.interface';
import {menuItems} from '@shared/components/sidenav/menu-items';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private readonly SIDEBAR_STATE_KEY = 'sidebarCollapsed';
  private router = inject(Router);


  private isCollapsed = signal<boolean>(false);
  private isMobileOpen = signal<boolean>(false);
  private menuItems = signal<MenuItem[]>(menuItems());


  isCollapsed$ = computed(() => this.isCollapsed());
  isMobileOpen$ = computed(() => this.isMobileOpen());
  menuItems$ = computed(() => this.menuItems());

  constructor() {
    const savedState = localStorage.getItem(this.SIDEBAR_STATE_KEY);
    if (savedState !== null) {
      this.isCollapsed.set(JSON.parse(savedState));
    }
    effect(() => localStorage.setItem(this.SIDEBAR_STATE_KEY, JSON.stringify(this.isCollapsed())));
  }

  toggleSidebar(): void {
    this.isCollapsed.update(value => !value);
  }

  toggleMobile(): void {
    this.isMobileOpen.update(value => !value);
  }

  closeMobile(): void {
    this.isMobileOpen.set(false);
  }

  selectMenuItem(item: MenuItem): void {
    this.menuItems.update(items =>
      items.map(menuItem => ({
        ...menuItem,
        active: menuItem === item
      }))
    );
    this.closeMobile();
    this.router.navigate([item.route]);
  }
}

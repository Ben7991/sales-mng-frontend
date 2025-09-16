import {computed, effect, inject, Injectable, signal} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  private currentRoute = signal<string>('');
  private baseMenuItems = menuItems;

  isCollapsed$ = computed(() => this.isCollapsed());
  isMobileOpen$ = computed(() => this.isMobileOpen());


  menuItems$ = computed(() => {
    const current = this.currentRoute();
    return this.baseMenuItems().map(item => ({
      ...item,
      active: current === item.route
    }));
  });

  constructor() {
    const savedState = localStorage.getItem(this.SIDEBAR_STATE_KEY);
    if (savedState !== null) {
      this.isCollapsed.set(JSON.parse(savedState));
    }

    effect(() => localStorage.setItem(this.SIDEBAR_STATE_KEY, JSON.stringify(this.isCollapsed())));

    this.currentRoute.set(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url);
      });
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
    this.closeMobile();
    this.router.navigate([item.route]);
  }
}

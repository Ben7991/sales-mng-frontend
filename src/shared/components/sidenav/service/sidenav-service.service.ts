import {computed, effect, inject, Injectable, signal} from '@angular/core';
import { Router } from '@angular/router';
import {menuItems} from '@shared/components/sidenav/menu-items';
import {LocalStorageKeys, LocalStorageService} from '@shared/services/localstorage/localstorage.service';
import {MenuItem} from '@shared/components/sidenav/sidenav.interface';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private readonly localStorageService = inject(LocalStorageService);
  private router = inject(Router);


  private isCollapsed = signal<boolean>(false);
  private isMobileOpen = signal<boolean>(false);
  private menuItems = signal<MenuItem[]>(menuItems());


  isCollapsed$ = computed(() => this.isCollapsed());
  isMobileOpen$ = computed(() => this.isMobileOpen());
  menuItems$ = computed(() => this.menuItems());

  constructor() {
    const savedState = this.localStorageService.getLocalStorageItem(LocalStorageKeys.SIDEBAR_STATE_KEY);
    if (savedState !== null) {
      if (typeof savedState === "string") {
        this.isCollapsed.set(JSON.parse(savedState));
      }
    }
    effect(() => this.localStorageService.setLocalStorageItem(LocalStorageKeys.SIDEBAR_STATE_KEY, JSON.stringify(this.isCollapsed())));
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

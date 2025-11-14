import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { menuItems } from '@shared/components/sidenav/menu-items';
import { MenuItem } from '@shared/components/sidenav/sidenav.interface';
import { AuthorizationService } from '@shared/services/auth/authorization.service';
import { LocalStorageKeys, LocalStorageService } from '@shared/services/localstorage/localstorage.service';
import { UserService } from '@shared/services/state/user/user.service';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly userService = inject(UserService);
  private readonly authorizationService = inject(AuthorizationService);
  private router = inject(Router);
  private isCollapsed = signal<boolean>(false);
  private isMobileOpen = signal<boolean>(false);
  private menuItems = signal<MenuItem[]>(menuItems);

  public isCollapsed$ = computed(() => this.isCollapsed());
  public isMobileOpen$ = computed(() => this.isMobileOpen());

  public menuItems$ = computed(() => {
    const user = this.userService.user;

    // If no user, return empty menu items (they will be loaded when user is fetched)
    if (!user) {
      return [];
    }

    // Filter menu items based on user permissions
    return this.menuItems().filter(item => {
      // If menu item has no page assigned, show it (unrestricted access)
      if (item.feature === undefined) {
        return true;
      }

      return this.authorizationService.canAccessPage(item.feature);
    });
  });

  constructor() {
    const savedState = this.localStorageService.getLocalStorageItem(LocalStorageKeys.SIDEBAR_STATE_KEY);
    if (savedState !== null) {
      if (typeof savedState === "string") {
        this.isCollapsed.set(JSON.parse(savedState));
      }
    }

    // Listen to router events to update active menu item
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveMenuItem(event.url);
    });

    // Set initial active state based on current route
    this.updateActiveMenuItem(this.router.url);

    effect(() => this.localStorageService.setLocalStorageItem(LocalStorageKeys.SIDEBAR_STATE_KEY, JSON.stringify(this.isCollapsed())));
  }

  private updateActiveMenuItem(url: string): void {
    this.menuItems.update(items =>
      items.map(menuItem => ({
        ...menuItem,
        active: url.includes(menuItem.route)
      }))
    );
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
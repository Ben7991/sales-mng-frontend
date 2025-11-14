import { inject, Injectable } from '@angular/core';
import { RBAC } from '@shared/constants/rbac.constants';
import { Page } from '@shared/models/enums';
import { UserRole } from '@shared/models/types';
import { UserService } from '../state/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private readonly userService = inject(UserService);

  public canAccessPage(page: Page): boolean {
    const user = this.userService.user;
    if (!user) return false;

    const pageConfigs = RBAC[page];
    if (!pageConfigs) return false;

    // Check if user's role is in any of the page configurations
    return pageConfigs.some(config => config.roles.includes(user.role));
  }

  public hasFeatureAccess(page: Page, feature: string): boolean {
    const user = this.userService.user;
    if (!user) return false;

    const pageConfigs = RBAC[page];
    if (!pageConfigs) return false;

    // Find the config that matches the user's role
    const userConfig = pageConfigs.find(
      config => config.roles.includes(user.role)
    );
    if (!userConfig) return false;

    if (userConfig.features === 'ALL') {
      return true;
    }

    // Check if the feature is in the user's feature list
    return userConfig.features.includes(feature);
  }

  public canAccessPageFeature(page: Page, feature?: string): boolean {
    if (!feature) {
      return this.canAccessPage(page);
    }

    return this.hasFeatureAccess(page, feature);
  }

  public getAccessiblePages(): Page[] {
    const user = this.userService.user;
    if (!user) return [];

    const accessiblePages: Page[] = [];
    const allPages = Object.keys(RBAC).map(key => parseInt(key) as Page);

    for (const page of allPages) {
      if (this.canAccessPage(page)) {
        accessiblePages.push(page);
      }
    }

    return accessiblePages;
  }

  public getUserRole(): UserRole | null {
    const user = this.userService.user;
    return user?.role ?? null;
  }

  public isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }
}

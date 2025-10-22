import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, TitleCasePipe, UpperCasePipe, Location } from '@angular/common';
import { AuthService } from '@shared/services/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { NAVIGATION_ROUTES } from '@shared/constants/navigation.constant';

@Component({
  selector: 'app-header',
  imports: [
    UpperCasePipe,
    TitleCasePipe,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatIconModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly location = inject(Location);
  private readonly platformId = inject(PLATFORM_ID);

  @Input() pageTitle: string = '';
  @Input() toggleSidenavCallback: () => void = () => {};

  public userName: string = '';
  public userInitials: string = '';
  public hasNotifications: boolean = false;
  public isMenuTriggered = false;

  ngOnInit() {
    this.authService
      .getUserDetails()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.userName = user.data.name;
          const nameParts = this.userName.split(' ');
          this.userInitials = nameParts.map((word) => word.charAt(0)).join('');
          this.cdr.markForCheck();
        },
      });


    let initialPath = '';
    if (isPlatformBrowser(this.platformId)) {
      initialPath =
        window.location.pathname ||
        this.router.url ||
        this.location.path();
    } else {
      initialPath = this.router.url || this.location.path();
    }

    this.setPageTitleFromUrl(initialPath);


    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const url = event.urlAfterRedirects || event.url;
          this.setPageTitleFromUrl(url);
        }
      });
  }

  private setPageTitleFromUrl(rawUrl: string | null | undefined) {
    if (!rawUrl) {
      this.pageTitle = '';
      this.cdr.markForCheck();
      return;
    }

    const path = rawUrl.split('?')[0].split('#')[0];
    const segments = path.split('/').filter(Boolean);

    const mainIndex = segments.indexOf('main');
    let candidate: string;

    if (mainIndex !== -1 && segments.length > mainIndex + 1) {
      candidate = segments[mainIndex + 1];
    } else if (segments.length) {
      candidate = segments[segments.length - 1];
    } else {
      candidate = '';
    }

    this.pageTitle = this.formatSegmentToTitle(candidate);
    this.cdr.markForCheck();
  }

  private formatSegmentToTitle(segment: string): string {
    if (!segment) return '';
    const spaced = segment
      .replace(/[-_]+/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2');

    return spaced
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  public navigateToSettings(): void {
    void this.router.navigateByUrl(NAVIGATION_ROUTES.SETTINGS.HOME);
  }

  toggleSidenav() {
    this.toggleSidenavCallback();
  }
}

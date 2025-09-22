import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, Input, OnInit} from '@angular/core';
import {AuthService} from '@shared/services/auth/auth.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TitleCasePipe, UpperCasePipe} from '@angular/common';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {NavigationEnd, Router} from '@angular/router';
import {NAVIGATION_ROUTES} from '@shared/constants/navigation.constant';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    UpperCasePipe,
    TitleCasePipe,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService)
  @Input() pageTitle: string = '';
  public userName: string = '';
  public userInitials: string = '';
  public hasNotifications: boolean = false;
  public isMenuTriggered = false
  private readonly router = inject(Router);
  @Input() toggleSidenavCallback: () => void = () => {};
  private readonly destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private readonly location = inject(Location);


  ngOnInit() {
    this.authService.getUserDetails()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.userName = user.data.name;
          const nameParts = this.userName.split(' ');
          const firstChars = nameParts.map((word) => word.charAt(0));
          this.userInitials = firstChars.join('');
          this.cdr.markForCheck();
        },
      });

    const initialPath = window.location.pathname || this.router.url || this.location.path();
    this.setPageTitleFromUrl(initialPath);

    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          const url = (event as NavigationEnd).urlAfterRedirects || (event as NavigationEnd).url;
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
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  public navigateToSettings(): void {
    void this.router.navigateByUrl(NAVIGATION_ROUTES.SETTINGS.HOME)
  }

  toggleSidenav() {
    this.toggleSidenavCallback();
  }
}

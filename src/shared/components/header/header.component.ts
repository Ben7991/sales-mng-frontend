import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, Input, OnInit} from '@angular/core';
import {AuthService} from '@shared/services/auth/auth.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TitleCasePipe, UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    UpperCasePipe,
    TitleCasePipe

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
  @Input() toggleSidenavCallback: () => void = () => {};
  private readonly destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

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
  }

  toggleSidenav() {
    this.toggleSidenavCallback();
  }
}

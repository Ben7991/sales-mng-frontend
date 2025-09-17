import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { NAVIGATION_ROUTES } from '@shared/constants/navigation.constant';
import { SnackbarService } from '@shared/services/snackbar/snackbar.service';
import { UserService } from '@shared/services/state/user/user.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly snackbarService = inject(SnackbarService);
  private readonly fb = inject(FormBuilder);

  protected readonly isSubmittingForm = signal(false);

  protected readonly loginForm: FormGroup = this.fb.group({
    usernameOrEmail: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  protected readonly forgotPasswordRoute = NAVIGATION_ROUTES.AUTH.FORGOT_PASSWORD;

  public onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }

    this.isSubmittingForm.set(true);

    this.authService.login(this.loginForm.value)
      .pipe(
        finalize(() => this.isSubmittingForm.set(false))
      )
      .subscribe({
        next: (response) => {
          this.authService.setAccessToken(response.data.accessToken);
          this.userService.user = response.data.user;

          void this.router.navigateByUrl(NAVIGATION_ROUTES.USERS.HOME) // temp: set home route to user mgnt page
        },
        error: (err: HttpErrorResponse) => {
          this.snackbarService.showError(err.error.message)
        }
      })
  }
}

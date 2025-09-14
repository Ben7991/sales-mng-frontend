import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from "@shared/components/input/input.component";
import { TOAST_MESSAGES } from '@shared/constants/general.constants';
import { NAVIGATION_ROUTES } from '@shared/constants/navigation.constant';
import { SnackbarService } from '@shared/services/snackbar/snackbar.service';
import { AuthService } from 'pages/auth/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-psw-form',
  imports: [
    InputComponent,
    ReactiveFormsModule,
    ButtonComponent,
    RouterLink
  ],
  templateUrl: './forgot-psw-form.component.html',
  styleUrl: './forgot-psw-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPswFormComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackbarService = inject(SnackbarService);
  private readonly fb = inject(FormBuilder);

  protected readonly isSubmittingForm = signal(false);

  protected readonly forgotPswForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected readonly loginRoute = NAVIGATION_ROUTES.AUTH.LOGIN;

  public onRequestPassReset(): void {
    if (!this.forgotPswForm.valid) {
      return;
    }

    this.isSubmittingForm.set(true);

    this.authService.requestPasswordResetLink(this.forgotPswForm.value)
      .pipe(
        finalize(() => this.isSubmittingForm.set(false))
      )
      .subscribe({
        next: (response) => {
          this.snackbarService.showInfo(response.message);
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);
        }
      })
  }
}

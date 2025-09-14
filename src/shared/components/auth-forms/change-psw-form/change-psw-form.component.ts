import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { TOAST_MESSAGES } from '@shared/constants/general.constants';
import { NAVIGATION_ROUTES } from '@shared/constants/navigation.constant';
import { SnackbarService } from '@shared/services/snackbar/snackbar.service';
import { AuthService } from 'pages/auth/services/auth.service';
import { passwordMatchValidator } from 'pages/auth/validators/password-match.validator';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-change-psw-form',
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    InputComponent
  ],
  templateUrl: './change-psw-form.component.html',
  styleUrl: './change-psw-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePswFormComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackbarService = inject(SnackbarService);
  private readonly fb = inject(FormBuilder);

  protected showPasswordMismatchMsg = signal(false);
  protected isSubmittingForm = signal(false);

  public changePswForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  }, { validators: passwordMatchValidator });

  private readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.changePswForm.valueChanges
      .pipe(
        debounceTime(200),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const newPasswordControl = this.changePswForm.get('newPassword');
        const confirmPasswordControl = this.changePswForm.get('confirmPassword');
        if (
          newPasswordControl?.touched &&
          confirmPasswordControl?.touched &&
          newPasswordControl.value != confirmPasswordControl.value
        ) {
          this.showPasswordMismatchMsg.set(true);
        }
        else {
          this.showPasswordMismatchMsg.set(false);
        }
      })
  }

  public onRequestPassReset() {
    if (!this.changePswForm.valid) {
      return;
    }

    this.isSubmittingForm.set(true);

    const token = this.activatedRoute.snapshot.queryParamMap.get('token');
    if (!token) {
      this.snackbarService.showError('No token provided');
      return;
    }

    this.authService.resetPassword(this.changePswForm.value, token)
      .pipe(
        finalize(() => this.isSubmittingForm.set(false))
      )
      .subscribe({
        next: ({ message }) => {
          this.snackbarService.showSuccess(message);

          void this.router.navigateByUrl(NAVIGATION_ROUTES.AUTH.LOGIN);
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);
        }
      })

  }
}

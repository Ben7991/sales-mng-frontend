import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {ButtonComponent} from '@shared/components/button/button.component';
import {passwordMatchValidator} from '../../../auth/validators/password-match.validator';
import {AuthService} from '@shared/services/auth/auth.service';
import {SnackbarService} from '@shared/services/snackbar/snackbar.service';
import {User} from '@shared/models/interface';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-password',
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    ButtonComponent,
    MatLabel,
    MatError
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordComponent implements OnInit{
  public authUser = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly snackbarService = inject(SnackbarService)
  private destroyRef =inject(DestroyRef)
  public readonly passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });
  public currentUser!: User


  public isFieldInvalid(fieldName: string): boolean {
    const field = this.passwordForm.get(fieldName);
    return !!(field?.invalid && (field?.touched || field?.dirty));
  }

  ngOnInit() {
    this.authUser.getUserDetails().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.currentUser =response.data
      },
    });
  }

 public onSubmit() {
    if (this.passwordForm.invalid) return;
    const payload = {
      userId: this.currentUser.id,
      role: this.currentUser.role,
      email: this.currentUser.email,
      name: this.currentUser.name,
      username: this.currentUser.username,
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword,
      confirmPassword: this.passwordForm.value.confirmPassword
    };

    this.authUser.changePassword(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.snackbarService.showSuccess(response.message)
      },
      error: error => {
        this.snackbarService.showError(error.error.message);
      }
    })

  }
}

import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {User} from '@shared/models/interface';
import {AuthService} from '@shared/services/auth/auth.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ButtonComponent} from '@shared/components/button/button.component';
import {SnackbarService} from '@shared/services/snackbar/snackbar.service';

@Component({
  selector: 'app-general',
  imports: [
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatSelectModule,
    ButtonComponent
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralComponent implements OnInit {
  private readonly snackbarService = inject(SnackbarService);
  private readonly formBuilder = inject(FormBuilder);
  public authUser = inject(AuthService);
  public destroyRef = inject(DestroyRef);
  public user!: User;
  protected readonly isSubmittingForm = signal(false);

  public isEditMode = false;

  public readonly userForm: FormGroup = this.formBuilder.group({
    name: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    role: [{ value: '', disabled: true }, [Validators.required]],
    username: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
  });

  ngOnInit(): void {
    this.getUserData();
  }

  private initializeForm(): void {
    this.userForm.patchValue(this.user);
  }

  public getUserData() {
    this.authUser.getUserDetails()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.user = user.data;
          this.initializeForm();
        }
      });
  }

  public enableEditing(): void {
    this.isEditMode = true;
    this.userForm.get('name')?.enable();
    this.userForm.get('email')?.enable();
    this.userForm.get('username')?.enable();
  }

  public cancelEditing(): void {
    this.isEditMode = false;
    this.initializeForm();
    this.userForm.get('name')?.disable();
    this.userForm.get('email')?.disable();
    this.userForm.get('username')?.disable();
  }

  public onSubmit() {
    this.isSubmittingForm.set(true)
    if (this.userForm.invalid) return;
    const updatedUser = this.userForm.getRawValue();
    this.authUser.updateDetails(updatedUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
       this.snackbarService.showSuccess(response.message)
        this.isSubmittingForm.set(false)
        this.ngOnInit()
      },
      error: error => {
        this.snackbarService.showError(error.error.message);
        this.isSubmittingForm.set(false)
      }
    });

    this.isEditMode = false;
    this.userForm.get('name')?.disable();
    this.userForm.get('email')?.disable();
    this.userForm.get('username')?.disable();
  }
}


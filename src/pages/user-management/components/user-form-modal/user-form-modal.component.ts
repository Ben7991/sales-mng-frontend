import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {ButtonComponent} from '@shared/components/button/button.component';
import {addUserInterface, UserFormModalData} from '../../interface';

@Component({
  selector: 'app-user-form-modal',
  imports: [
    MatFormField,
    MatInput,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOption,
    ButtonComponent
  ],
  templateUrl: './user-form-modal.component.html',
  styleUrl: './user-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormModalComponent implements OnInit{
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UserFormModalComponent>);
  private readonly modalData = inject<UserFormModalData>(MAT_DIALOG_DATA);

  public readonly isSubmitting = signal<boolean>(false);
  public readonly isEditMode = signal<boolean>(false);
  public readonly availableRoles = signal([
    { value: 'SALES_PERSON', label: 'Sales Person' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'PROCUREMENT_OFFICER', label: 'Procurement Officer' },
  ]);


  public readonly userForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['', [Validators.required]],
    username: ['', [Validators.required, Validators.minLength(2)]]
  });

  ngOnInit(): void {
    this.initializeForm();
  }


  private initializeForm(): void {
    if (this.modalData?.isEdit && this.modalData?.user) {
      this.isEditMode.set(true);
      this.userForm.patchValue(this.modalData.user);
    }
  }


  public isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field?.invalid && (field?.touched || field?.dirty));
  }

  public onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting.set(true);

      const formData: addUserInterface = this.userForm.value;

        this.dialogRef.close({
          action: 'confirm',
          data: {
            ...formData,
          }
        });
        this.isSubmitting.set(false);
    } else {

      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
  }

  public onCancel(): void {
    this.dialogRef.close({ action: 'cancel' });
  }


  public getFormData(): addUserInterface | null {
    return this.userForm.valid ? this.userForm.value : null;
  }
}

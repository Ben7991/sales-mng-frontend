import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Supplier } from 'pages/suppliers/models/interface';

interface DialogData {
  isEdit: boolean;
  supplier?: Supplier;
}

@Component({
  selector: 'app-supplier-form-modal',
  standalone: true,
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './supplier-form-modal.component.html',
  styleUrl: './supplier-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplierFormModalComponent implements OnInit {
  protected supplierForm!: FormGroup;
  protected isEdit: boolean;
  private readonly originalSupplier?: Supplier;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<SupplierFormModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private readonly data: DialogData
  ) {
    this.isEdit = data.isEdit;
    this.originalSupplier = data.supplier;
  }

  ngOnInit() {
    this.initializeForm();
    if (this.isEdit && this.originalSupplier) {
      this.populateForm();
    }
  }

  private initializeForm() {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      status: ['ACTIVE'],
      phones: this.fb.array([this.createPhoneControl()])
    });
  }

  private createPhoneControl(phone: string = '') {
    return this.fb.control(phone, [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]);
  }

  private populateForm() {
    if (!this.originalSupplier) return;

    this.supplierForm.patchValue({
      name: this.originalSupplier.name,
      companyName: this.originalSupplier.companyName,
      email: this.originalSupplier.email,
      status: this.originalSupplier.status
    });

    const phoneArray = this.phonesFormArray;
    phoneArray.clear();

    this.originalSupplier.supplierPhones.forEach(phone => {
      phoneArray.push(this.createPhoneControl(phone.phone));
    });

    if (phoneArray.length === 0) {
      phoneArray.push(this.createPhoneControl());
    }
  }

  protected get phonesFormArray(): FormArray {
    return this.supplierForm.get('phones') as FormArray;
  }

  protected addPhone() {
    this.phonesFormArray.push(this.createPhoneControl());
  }

  protected removePhone(index: number) {
    if (this.phonesFormArray.length > 1) {
      this.phonesFormArray.removeAt(index);
    }
  }

  protected onSubmit() {
    if (this.supplierForm.valid) {
      const formValue = this.supplierForm.value;

      if (this.isEdit) {
        const updateData = this.prepareUpdateData(formValue);
        this.dialogRef.close({ action: 'confirm', data: updateData });
      } else {
        const addData = {
          name: formValue.name,
          companyName: formValue.companyName,
          email: formValue.email,
          phones: formValue.phones.filter((phone: string) => phone.trim())
        };
        this.dialogRef.close({ action: 'confirm', data: addData });
      }
    }
  }

  private prepareUpdateData(formValue: any) {
    const updateData: any = {};
    const original = this.originalSupplier!;

    const hasBasicChanges =
      formValue.name !== original.name ||
      formValue.companyName !== original.companyName ||
      formValue.email !== original.email;

    if (hasBasicChanges) {
      updateData.basicInfo = {
        name: formValue.name,
        companyName: formValue.companyName,
        email: formValue.email
      };
    }

    if (formValue.status !== original.status) {
      updateData.status = { status: formValue.status };
    }

    const originalPhones = original.supplierPhones.map(p => p.phone);
    const newPhones = formValue.phones.filter((phone: string) => phone.trim());

    const phonesToAdd = newPhones.filter((phone: string) => !originalPhones.includes(phone));
    const phonesToDelete = original.supplierPhones
      .filter(phone => !newPhones.includes(phone.phone))
      .map(phone => phone.id);

    if (phonesToAdd.length > 0) {
      updateData.phonesToAdd = phonesToAdd;
    }

    if (phonesToDelete.length > 0) {
      updateData.phonesToDelete = phonesToDelete;
    }

    return updateData;
  }

  protected onCancel() {
    this.dialogRef.close({ action: 'cancel' });
  }
}

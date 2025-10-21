import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LiveSearchDropdownComponent } from '@shared/components/live-search-dropdown/live-search-dropdown.component';
import { LiveSearchItem } from '@shared/models/interface';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { Customer } from '../../models/interface';
import { CustomerManagementService } from '../../services/customer-management.service';

interface DialogData {
  isEdit: boolean;
  customer?: Customer;
}

@Component({
  selector: 'app-customer-form-modal',
  standalone: true,
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    LiveSearchDropdownComponent,
    CommonModule
  ],
  templateUrl: './customer-form-modal.component.html',
  styleUrl: './customer-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerFormModalComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerManagementService);
  private readonly destroy$ = new Subject<void>();

  protected customerForm!: FormGroup;
  protected isEdit: boolean;
  private readonly originalCustomer?: Customer;

  // Live search state
  protected showLiveSearch = signal(false);
  protected isSearching = signal(false);
  protected searchResults = signal<LiveSearchItem[]>([]);
  private searchSubject = new Subject<string>();

  constructor(
    private readonly dialogRef: MatDialogRef<CustomerFormModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private readonly data: DialogData
  ) {
    this.isEdit = data.isEdit;
    this.originalCustomer = data.customer;
  }

  ngOnInit() {
    this.initializeForm();
    this.setupLiveSearch();
    
    if (this.isEdit && this.originalCustomer) {
      this.populateForm();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phones: this.fb.array([this.createPhoneControl()])
    });
  }

  private setupLiveSearch() {
    if (this.isEdit) return; // Only for add mode

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        switchMap(query => {
          if (query.length < 2) {
            this.showLiveSearch.set(false);
            return EMPTY;
          }

          this.isSearching.set(true);
          this.showLiveSearch.set(true);

          return this.customerService.searchCustomers(query).pipe(
            catchError(() => {
              this.isSearching.set(false);
              this.showLiveSearch.set(false);
              return EMPTY;
            })
          );
        })
      )
      .subscribe(response => {
        this.isSearching.set(false);
        const searchItems: LiveSearchItem[] = response.data.map(customer => ({
          id: customer.id.toString(),
          name: customer.name
        }));
        this.searchResults.set(searchItems);
      });

    // Watch name field changes for live search
    this.customerForm.get('name')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (!this.isEdit) {
          this.searchSubject.next(value || '');
        }
      });
  }

  private createPhoneControl(phone: string = '') {
    return this.fb.control(phone, [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]);
  }

  private populateForm() {
    if (!this.originalCustomer) return;

    this.customerForm.patchValue({
      name: this.originalCustomer.name,
      address: this.originalCustomer.address
    });

    const phoneArray = this.phonesFormArray;
    phoneArray.clear();

    for (const phone of this.originalCustomer.customerPhones) {
      phoneArray.push(this.createPhoneControl(phone.phone));
    }

    if (phoneArray.length === 0) {
      phoneArray.push(this.createPhoneControl());
    }
  }

  get phonesFormArray(): FormArray {
    return this.customerForm.get('phones') as FormArray;
  }

  protected addPhone() {
    this.phonesFormArray.push(this.createPhoneControl());
  }

  protected removePhone(index: number) {
    if (this.phonesFormArray.length > 1) {
      this.phonesFormArray.removeAt(index);
    }
  }

  protected onLiveSearchItemSelected(item: LiveSearchItem) {
    this.showLiveSearch.set(false);
    this.customerForm.get('name')?.setValue(item.name);
  }

  protected onNameInputBlur() {
    // Small delay to allow item selection
    setTimeout(() => {
      this.showLiveSearch.set(false);
    }, 200);
  }

  protected onSubmit() {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.value;

      if (this.isEdit) {
        const updateData = this.prepareUpdateData(formValue);
        this.dialogRef.close({ action: 'confirm', data: updateData });
      } else {
        const addData = {
          name: formValue.name,
          address: formValue.address,
          phones: formValue.phones.filter((phone: string) => phone.trim())
        };
        this.dialogRef.close({ action: 'confirm', data: addData });
      }
    }
  }

  private prepareUpdateData(formValue: any) {
    const updateData: any = {};
    const original = this.originalCustomer!;

    const hasBasicChanges =
      formValue.name !== original.name ||
      formValue.address !== original.address;

    if (hasBasicChanges) {
      updateData.basicInfo = {
        name: formValue.name,
        address: formValue.address
      };
    }

    const originalPhonesSet = new Set(original.customerPhones.map(p => p.phone));
    const newPhones = formValue.phones.filter((phone: string) => phone.trim());

    const phonesToAdd = newPhones.filter((phone: string) => !originalPhonesSet.has(phone));
    const phonesToDelete = original.customerPhones
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
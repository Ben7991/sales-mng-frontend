import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import environment from '@shared/environments/environment';
import { SnackbarService } from '@shared/services/snackbar/snackbar.service';
import { toTitleCase } from '@shared/utils/string.util';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap, tap } from 'rxjs';
import { Category, Product, ProductLiveSearchItem, ProductStatus } from '../../models/interface';
import { ProductsManagementService } from '../../services/products-management.service';

const LIVE_SEARCH_DEBOUNCE_TIME = 50;

interface ProductFormModalData {
  isEdit: boolean;
  product?: Product;
  categories: Category[];
}

@Component({
  selector: 'app-product-form-modal',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ButtonComponent,
    ImageUploadComponent
  ],
  templateUrl: './product-form-modal.component.html',
  styleUrl: './product-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormModalComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ProductFormModalComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly snackbarService = inject(SnackbarService);
  private readonly productsService = inject(ProductsManagementService);
  protected readonly data = inject<ProductFormModalData>(MAT_DIALOG_DATA);

  protected readonly productForm!: FormGroup;
  protected readonly isSubmitting = signal(false);
  protected readonly selectedFile = signal<File | null>(null);
  protected readonly productStatuses: { value: ProductStatus; label: string }[] = [
    { value: 'IN_USE', label: 'In use' },
    { value: 'DISCONTINUED', label: 'Discontinued' }
  ];

  // Live search properties
  protected readonly searchResults = signal<ProductLiveSearchItem[]>([]);
  protected readonly isSearching = signal(false);
  protected readonly showSearchDropdown = signal(false);
  protected readonly isDuplicateName = signal(false);
  private readonly searchSubject = new Subject<string>();

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      categoryId: [null, [Validators.required]],
      status: ['IN_USE']
    });

    // Setup debounced live search
    this.searchSubject
      .pipe(
        debounceTime(LIVE_SEARCH_DEBOUNCE_TIME),
        distinctUntilChanged(),
        tap(() => {
          // Clear previous results while waiting
          this.searchResults.set([]);
          this.showSearchDropdown.set(false);
        }),
        switchMap((query) => {
          if (!query || query.trim().length < 2) {
            this.isSearching.set(false);
            return of({ data: [] });
          }

          this.isSearching.set(true);
          return this.productsService.searchProducts(query.trim()).pipe(
            catchError(() => {
              this.isSearching.set(false);
              return of({ data: [] });
            })
          );
        })
      )
      .subscribe((response) => {
        this.isSearching.set(false);
        this.searchResults.set(response.data);
        this.showSearchDropdown.set(response.data.length > 0);

        // Check for duplicate name (case-insensitive)
        const currentName = this.productForm.get('name')?.value?.trim().toLowerCase();

        if (currentName && currentName.length >= 2) {
          const isDuplicate = response.data.some(product => {
            const productNameLower = product.name.toLowerCase();

            // For edit mode, allow the current product's name
            if (this.data.isEdit && this.data.product) {
              const currentProductNameLower = this.data.product.name.toLowerCase();
              // If it matches the current product being edited, it's not a duplicate
              if (productNameLower === currentProductNameLower) {
                return false;
              }
            }

            return productNameLower === currentName;
          });

          this.isDuplicateName.set(isDuplicate);

          // Set custom error on form control
          const nameControl = this.productForm.get('name');
          if (isDuplicate) {
            nameControl?.setErrors({ ...nameControl.errors, duplicate: true });
          } else if (nameControl?.hasError('duplicate')) {
            // Remove duplicate error if it exists
            const errors = { ...nameControl.errors };
            delete errors['duplicate'];
            nameControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
          }
        } else {
          this.isDuplicateName.set(false);
        }
      });
  }

  ngOnInit(): void {
    if (this.data.isEdit && this.data.product) {
      this.productForm.patchValue({
        name: toTitleCase(this.data.product.name),
        categoryId: this.data.product.category.id,
        status: this.data.product.status
      });
    }
  }

  protected get modalTitle(): string {
    return this.data.isEdit ? 'Edit Product' : 'Add New Product';
  }

  protected get submitButtonText(): string {
    return this.data.isEdit ? 'Save Product' : 'Add Product';
  }

  protected get existingImageUrl(): string | null {
    if (this.data.isEdit && this.data.product) {
      return `${environment.serverUrl}/${this.data.product.imagePath}`;
    }
    return null;
  }

  protected onFileSelected(file: File): void {
    this.selectedFile.set(file);
  }

  protected onFileError(errorMessage: string): void {
    this.snackbarService.showError(errorMessage);
  }

  protected onProductNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;
    const titleCased = toTitleCase(input.value);

    // Update form control
    this.productForm.get('name')?.setValue(titleCased, { emitEvent: false });

    // Update input value and restore cursor position
    if (titleCased !== input.value) {
      setTimeout(() => {
        input.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    }

    // Trigger live search
    this.searchSubject.next(titleCased);
  }

  protected onSelectSearchResult(productName: string, event?: MouseEvent): void {
    // Prevent default to avoid input losing focus or text selection issues
    if (event) {
      event.preventDefault();
    }

    this.productForm.get('name')?.setValue(productName);
    this.showSearchDropdown.set(false);

    // Check if this is a duplicate (case-insensitive)
    const selectedNameLower = productName.toLowerCase();
    let isDuplicate = false;

    // For edit mode, check if it's not the current product
    if (this.data.isEdit && this.data.product) {
      const currentProductNameLower = this.data.product.name.toLowerCase();
      isDuplicate = selectedNameLower !== currentProductNameLower;
    } else {
      // For add mode, any selected product is a duplicate
      isDuplicate = true;
    }

    this.isDuplicateName.set(isDuplicate);

    // Set or clear the duplicate error on form control
    const nameControl = this.productForm.get('name');
    if (isDuplicate) {
      nameControl?.setErrors({ ...nameControl.errors, duplicate: true });
      nameControl?.markAsTouched();
    } else if (nameControl?.hasError('duplicate')) {
      const errors = { ...nameControl.errors };
      delete errors['duplicate'];
      nameControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }

    // Clear search results after setting error
    this.searchResults.set([]);
  }

  protected onInputFocus(): void {
    const currentValue = this.productForm.get('name')?.value || '';
    if (currentValue.trim().length >= 2 && this.searchResults().length > 0) {
      this.showSearchDropdown.set(true);
    }
  }

  protected onInputBlur(): void {
    // Delay hiding to allow click event on dropdown items
    setTimeout(() => {
      this.showSearchDropdown.set(false);
    }, 200);
  }

  protected toTitleCase(str: string): string {
    return toTitleCase(str);
  }

  protected onCancel(): void {
    this.dialogRef.close({ action: 'cancel' });
  }

  protected onSubmit(): void {
    // For add mode, file is required
    if (!this.data.isEdit && !this.selectedFile()) {
      this.snackbarService.showError('Please select a product image');
      return;
    }

    // Check for duplicate product name
    if (this.isDuplicateName() || this.productForm.get('name')?.hasError('duplicate')) {
      this.snackbarService.showError('This product name already exists. Please choose a unique name.');
      this.productForm.markAllAsTouched();
      return;
    }

    if (this.productForm.valid) {
      const formData = {
        ...this.productForm.value,
        file: this.selectedFile()
      };

      this.dialogRef.close({
        action: 'confirm',
        data: formData
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}

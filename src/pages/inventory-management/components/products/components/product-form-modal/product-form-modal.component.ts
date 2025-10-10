import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { Category, Product, ProductStatus } from '../../models/interface';
import { SnackbarService } from '@shared/services/snackbar/snackbar.service';
import environment from '@shared/environments/environment';
import { toTitleCase } from '@shared/utils/string.util';

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
  protected readonly data = inject<ProductFormModalData>(MAT_DIALOG_DATA);

  protected readonly productForm!: FormGroup;
  protected readonly isSubmitting = signal(false);
  protected readonly selectedFile = signal<File | null>(null);
  protected readonly productStatuses: { value: ProductStatus; label: string }[] = [
    { value: 'IN_USE', label: 'In use' },
    { value: 'DISCONTINUED', label: 'Discontinued' }
  ];

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      categoryId: [null, [Validators.required]],
      status: ['IN_USE']
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

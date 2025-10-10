import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Category } from '../../models/interface';
import { toTitleCase } from '@shared/utils/string.util';

interface CategoryFormModalData {
  isEdit: boolean;
  category?: Category;
}

@Component({
  selector: 'app-category-form-modal',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './category-form-modal.component.html',
  styleUrl: './category-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryFormModalComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CategoryFormModalComponent>);
  private readonly fb = inject(FormBuilder);
  protected readonly data = inject<CategoryFormModalData>(MAT_DIALOG_DATA);

  protected readonly categoryForm!: FormGroup;
  protected readonly isSubmitting = signal(false);

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    if (this.data.isEdit && this.data.category) {
      this.categoryForm.patchValue({
        name: toTitleCase(this.data.category.name)
      });
    }
  }

  protected get modalTitle(): string {
    return this.data.isEdit ? 'Edit Category' : 'Add New Category';
  }

  protected get submitButtonText(): string {
    return this.data.isEdit ? 'Save Category' : 'Create Category';
  }

  protected onCategoryNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;
    const titleCased = toTitleCase(input.value);
    
    // Update form control
    this.categoryForm.get('name')?.setValue(titleCased, { emitEvent: false });
    
    // Update input value and restore cursor position
    if (titleCased !== input.value) {
      setTimeout(() => {
        input.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    }
  }

  protected onCancel(): void {
    this.dialogRef.close({ action: 'cancel' });
  }

  protected onSubmit(): void {
    if (this.categoryForm.valid) {
      const formData = this.categoryForm.value;
      this.dialogRef.close({
        action: 'confirm',
        data: formData
      });
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}

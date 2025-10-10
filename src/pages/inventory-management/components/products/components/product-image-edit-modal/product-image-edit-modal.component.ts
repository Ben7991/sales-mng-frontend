import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { SnackbarService } from '@shared/services/snackbar/snackbar.service';
import environment from '@shared/environments/environment';

interface ProductImageEditModalData {
  productId: number;
  productName: string;
  currentImagePath: string;
}

@Component({
  selector: 'app-product-image-edit-modal',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ButtonComponent,
    ImageUploadComponent
  ],
  templateUrl: './product-image-edit-modal.component.html',
  styleUrl: './product-image-edit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductImageEditModalComponent {
  private readonly dialogRef = inject(MatDialogRef<ProductImageEditModalComponent>);
  private readonly snackbarService = inject(SnackbarService);
  protected readonly data = inject<ProductImageEditModalData>(MAT_DIALOG_DATA);

  protected readonly selectedFile = signal<File | null>(null);
  protected readonly isSubmitting = signal(false);

  protected get existingImageUrl(): string {
    return `${environment.serverUrl}/${this.data.currentImagePath}`;
  }

  protected onFileSelected(file: File): void {
    this.selectedFile.set(file);
  }

  protected onFileError(errorMessage: string): void {
    this.snackbarService.showError(errorMessage);
  }

  protected onCancel(): void {
    this.dialogRef.close({ action: 'cancel' });
  }

  protected onSubmit(): void {
    if (!this.selectedFile()) {
      this.snackbarService.showError('Please select a new image');
      return;
    }

    this.dialogRef.close({
      action: 'confirm',
      data: {
        file: this.selectedFile()
      }
    });
  }
}

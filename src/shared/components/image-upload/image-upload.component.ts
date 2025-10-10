import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

@Component({
  selector: 'app-image-upload',
  imports: [MatIconModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadComponent {
  public readonly label = input<string>('Upload Image');
  public readonly existingImageUrl = input<string | null>(null);
  public readonly disabled = input(false);

  public readonly fileSelected = output<File>();
  public readonly uploadError = output<string>();

  protected readonly isDragging = signal(false);
  protected readonly previewUrl = signal<string | null>(null);
  protected readonly fileName = signal<string | null>(null);

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled()) {
      this.isDragging.set(true);
    }
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (this.disabled()) {
      return;
    }

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  protected onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  protected triggerFileInput(): void {
    if (!this.disabled()) {
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      fileInput?.click();
    }
  }

  protected removeImage(): void {
    this.previewUrl.set(null);
    this.fileName.set(null);
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  private handleFile(file: File): void {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.uploadError.emit('Please select a valid image file');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      this.uploadError.emit('File size must be less than 10MB');
      return;
    }

    this.fileName.set(file.name);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.previewUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Emit file to parent
    this.fileSelected.emit(file);
  }
}

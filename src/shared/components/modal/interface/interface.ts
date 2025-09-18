export interface ModalConfig {
  title?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  disableClose?: boolean;
  showCloseButton?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  confirmButtonColor?: 'primary' | 'accent' | 'warn';
}

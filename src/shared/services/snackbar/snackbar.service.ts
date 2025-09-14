import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  showSuccess(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['snackbar-success'],
    });
  }

  showError(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['snackbar-error'],
    });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['snackbar-info'],
    });
  }
}

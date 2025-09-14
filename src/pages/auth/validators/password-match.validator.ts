import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Checks if two password fields match.
 * @returns An object with a 'passwordMismatch' key if passwords don't match, otherwise null.
 */
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  // Return null if controls don't exist, are invalid, or if values are not ready
  if (!newPassword || !confirmPassword || newPassword.pristine || confirmPassword.pristine) {
    return null;
  }

  const match = newPassword.value === confirmPassword.value;
  return match ? null : { passwordMismatch: true };
};

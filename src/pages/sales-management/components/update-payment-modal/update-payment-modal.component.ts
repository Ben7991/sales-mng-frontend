import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from '@shared/components/button/button.component';
import { paymentMode } from '../../models/interface';

interface DialogData {
  orderId: number;
}

@Component({
  selector: 'app-update-payment-modal',
  standalone: true,
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    TitleCasePipe,
  ],
  templateUrl: './update-payment-modal.component.html',
  styleUrl: './update-payment-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdatePaymentModalComponent {
  protected paymentForm: FormGroup;
  protected readonly paymentModes: paymentMode[] = ['CASH', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CHEQUE'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<UpdatePaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.paymentForm = this.fb.group({
      paymentMode: [this.paymentModes[0], Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]]
    });
  }

  protected onSubmit() {
    if (this.paymentForm.valid) {
      this.dialogRef.close(this.paymentForm.value);
    }
  }

  protected onCancel() {
    this.dialogRef.close();
  }
}

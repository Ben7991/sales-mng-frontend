import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {UserAccountStatus} from '@shared/models/types';
import {ButtonComponent} from '@shared/components/button/button.component';

@Component({
  selector: 'app-change-status-modal',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatRadioGroup,
    FormsModule,
    MatRadioButton,
    NgForOf,
    MatDialogActions,
    MatButton,
    ButtonComponent
  ],
  templateUrl: './change-status-modal.component.html',
  styleUrl: './change-status-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeStatusModalComponent {
  statuses: UserAccountStatus[] = ['ACTIVE', 'FIRED', 'QUIT'];
  selectedStatus!: UserAccountStatus;

  constructor(
    private dialogRef: MatDialogRef<ChangeStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentStatus: UserAccountStatus }
  ) {
    this.selectedStatus = data.currentStatus;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm() {
    if (this.selectedStatus === this.data.currentStatus) {
      return;
    }
    this.dialogRef.close(this.selectedStatus);
  }

}

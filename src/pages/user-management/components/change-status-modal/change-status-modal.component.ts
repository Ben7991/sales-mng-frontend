import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';
import {ButtonComponent} from '@shared/components/button/button.component';
import {CommonModule, TitleCasePipe} from '@angular/common';

export type StatusKey = string;

export interface ChangeStatusModalData {
  title: string;
  currentStatus: StatusKey;
  availableStatuses: StatusKey[];
}

@Component({
  selector: 'app-change-status-modal',
  standalone: true,
  imports: [
    MatDialogContent,
    MatRadioGroup,
    FormsModule,
    MatRadioButton,
    ButtonComponent,
    CommonModule,
    TitleCasePipe
  ],
  templateUrl: './change-status-modal.component.html',
  styleUrl: './change-status-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeStatusModalComponent {

  public statuses: StatusKey[];
  public selectedStatus: StatusKey;

  constructor(
    private dialogRef: MatDialogRef<ChangeStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChangeStatusModalData
  ) {
    this.statuses = data.availableStatuses;
    this.selectedStatus = data.currentStatus;
  }

  getCleanStatus(status: string): string {
    return status.replace(/_/g, ' ');
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

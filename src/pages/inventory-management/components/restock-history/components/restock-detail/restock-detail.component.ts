import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {TitleCasePipe} from '@angular/common';
import {Inventory} from '../../../model/interface';

@Component({
  selector: 'app-restock-detail',
  imports: [
    MatIconModule,
    TitleCasePipe
  ],
  templateUrl: './restock-detail.component.html',
  styleUrl: './restock-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestockDetailComponent {
  private dialogRef = inject(MatDialogRef<RestockDetailComponent>);
  private readonly data = inject(MAT_DIALOG_DATA);

  public readonly detailData:Inventory = this.data.item;

  onClose(): void {
    this.dialogRef.close();
  }

  formatCurrency(value: string | number | null | undefined): string {
    const numericValue = Number(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      return 'N/A';
    }
    return `GH₵ ${numericValue.toFixed(2)}`;
  }
}

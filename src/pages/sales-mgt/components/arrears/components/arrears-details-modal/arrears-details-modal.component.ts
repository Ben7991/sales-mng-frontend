import {ChangeDetectionStrategy, Component, inject, Inject} from '@angular/core';
import {TableComponent} from '@shared/components/user-management/table/table.component';
import {TableColumn} from '@shared/components/user-management/table/interface/interface';
import {arrearDetailsTableColumns} from './constant/arreas-details.data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ArrearDetail, ArrearsDetailsData} from '../../models/types';
import {MatIconButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-arrears-details-modal',
  imports: [
    TableComponent,
    MatIconModule,
    MatIconButton
  ],
  templateUrl: './arrears-details-modal.component.html',
  styleUrl: './arrears-details-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrearsDetailsModalComponent {
  protected orderColumns: TableColumn[] = arrearDetailsTableColumns;
  private router = inject(Router)
  private readonly route = inject(ActivatedRoute);

  constructor(
    public dialogRef: MatDialogRef<ArrearsDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ArrearsDetailsData,
  ) {
  }

  close(): void {
    this.dialogRef.close();
  }

  goToOrder(order: ArrearDetail): void {
    this.dialogRef.close();
    this.router.navigate(['main/sales-management/orders'], {
      relativeTo: this.route.parent,
      queryParams: { q: order.orderId.toString() },
      queryParamsHandling: 'merge'
    });
  }


}

import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {ButtonComponent} from '@shared/components/button/button.component';
import {MatDivider} from '@angular/material/divider';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {SearchComponent} from '@shared/components/search/search.component';
import {MatIconModule} from '@angular/material/icon';
import {salesSearchConfig, salesTableActions, salesTableColumns} from './constants/sales.data';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {TableComponent} from '@shared/components/user-management/table/table.component';
import {SalesService} from './service/sales-service.service';
import {StatusConfig, TableAction, TableColumn} from '@shared/components/user-management/table/interface/interface';
import {PageEvent} from '@angular/material/paginator';
import {STATUS_COLORS} from '@shared/constants/colors.constant';
import {CreateOrderModalComponent} from './components/create-order-modal/create-order-modal.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-sales-management',
  imports: [
    ButtonComponent,
    MatDivider,
    MatIconModule,
    MatMenu,
    MatMenuItem,
    SearchComponent,
    MatMenuTrigger,
    MatProgressSpinner,
    TableComponent
  ],
  templateUrl: './sales-management.component.html',
  styleUrl: './sales-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesManagementComponent implements OnInit {
  private dialog = inject(MatDialog);
  protected SalesManagementService = inject(SalesService)
  onUserSearchTermChange($event: string) {
      throw new Error('Method not implemented.');
  }

  protected readonly salesSearchConfig = salesSearchConfig;
  protected readonly statusConfig: StatusConfig = {
    Active: STATUS_COLORS.ACTIVE,
    Inactive: STATUS_COLORS.INACTIVE
  };
  tableActions: TableAction[] = salesTableActions;
  tableColumns: TableColumn[]= salesTableColumns;

  ngOnInit() {
    this.SalesManagementService.getOrders();
  }

  filterStatus(s: string) {

  }

  openCreateOrderModal() {
    const dialogRef = this.dialog.open(CreateOrderModalComponent, {
      width: '700px',
      maxWidth: '90vw',
      maxHeight:'90%',
      disableClose: false,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result from the modal if needed
      }
    });
  }

  onSelectionChange($event: any[]) {

  }

  onActionClick($event: { action: string; item: any }) {

  }

  onPageChange($event: PageEvent) {

  }
}

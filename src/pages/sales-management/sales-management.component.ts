import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePaymentModalComponent } from './components/update-payment-modal/update-payment-modal.component';
import { OrderDetailsCanvasComponent } from './components/order-details-canvas/order-details-canvas.component';
import { getUpdateOrderPaymentUrl } from '@shared/constants/api.constants';
import { HttpClient } from '@angular/common/http';
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
import {CustomerManagementService} from '../customers/services/customer-management.service';
import {Customer} from '../customers/models/interface';
import {
  stockHistoryTableActions,
  stockHistoryTableColumns
} from '../inventory-management/components/restock-history/constant/history.const';
import { SalesOrder } from './models/interface';

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
    TableComponent,
    OrderDetailsCanvasComponent
  ],
  templateUrl: './sales-management.component.html',
  styleUrl: './sales-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesManagementComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  protected readonly SalesManagementService = inject(SalesService)
  protected readonly customerService = inject(CustomerManagementService)

  public readonly isLoadingCustomers = this.customerService.isLoadingCustomers;
  public readonly isLoading$ = this.SalesManagementService.isLoadingOrders;
  public readonly customers = this.customerService.customers;
  public readonly activeCustomerId = signal<number | null>(null);

  protected readonly currentPage = signal(0);
  protected readonly currentPerPage = signal(10);
  protected readonly clickedRow = signal<SalesOrder | null>(null);
  private readonly http = inject(HttpClient);

  onUserSearchTermChange($event: string) {
    this.SalesManagementService.searchQuery = $event;
    this.SalesManagementService.currentPage = 0;
    this.SalesManagementService.getOrders();
  }

  filterBySupplier(supplier: Customer | null): void {
    this.activeCustomerId.set(supplier!.id);
    this.currentPage.set(0);
    this.SalesManagementService.getOrders({
      page: this.currentPage(),
      perPage: this.currentPerPage(),
      q: supplier?.name
    });
  }

  protected readonly salesSearchConfig = salesSearchConfig;

  protected readonly statusConfig: StatusConfig = {
    'Outstanding': STATUS_COLORS.QUIT,
    'paid': STATUS_COLORS.ACTIVE,
    'Open': STATUS_COLORS.ACTIVE,
    'Delivered': STATUS_COLORS.INACTIVE
  };

  tableActions: TableAction[] = salesTableActions;
  tableColumns: TableColumn[]= salesTableColumns;

  ngOnInit() {
    this.SalesManagementService.getOrders();
    this.customerService.getCustomers();
  }

  filterStatus(s: string) {
    this.SalesManagementService.getOrders({
      page: this.currentPage(),
      perPage: this.currentPerPage(),
      q: s
    });
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
      }
    });
  }

  onRowItemClick(row: any): void {
    this.clickedRow.set(row as SalesOrder);
  }

  openUpdatePaymentModal = (orderId: number) => {
    const dialogRef = this.dialog.open(UpdatePaymentModalComponent, {
      width: '350px',
      maxWidth: '90vw',
      data: { orderId },
      disableClose: false,
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post(getUpdateOrderPaymentUrl(orderId), result).subscribe({
          next: () => {
            this.SalesManagementService.getOrders();
            if (this.clickedRow()) {
              this.clickedRow.set(this.clickedRow());
            }
          }
        });
      }
    });
  }

  onActionClick(event: { action: string; item: any }) {
    if (event.action === 'edit') {
      this.SalesManagementService.changeOrderStatusAndRefresh(event.item.id, 'DELIVERED');
    }
  }

  clearClickedRowItem(): void {
    this.clickedRow.set(null);
  }

  onPageChange(event: PageEvent) {
    this.SalesManagementService.currentPage = event.pageIndex;
    this.SalesManagementService.currentPageSize = event.pageSize;
    this.SalesManagementService.getOrders({
      page: event.pageIndex,
      perPage: event.pageSize
    });
  }
}

import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
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
import {CustomerManagementService} from '../customers/services/customer-management.service';
import {Customer} from '../customers/models/interface';
import {
  stockHistoryTableActions,
  stockHistoryTableColumns
} from '../inventory-management/components/restock-history/constant/history.const';

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
  protected readonly customerService = inject(CustomerManagementService)

  public readonly isLoadingCustomers = this.customerService.isLoadingCustomers;
  public readonly isLoading$ = this.SalesManagementService.isLoadingOrders;
  public readonly customers = this.customerService.customers;
  public activeCustomerId = signal<number | null>(null);

  public readonly currentPage = signal(0);
  public readonly currentPerPage = signal(10);

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

  onActionClick(event: { action: string; item: any }) {
    if (event.action === 'edit') {
      this.SalesManagementService.changeOrderStatusAndRefresh(event.item.id, 'DELIVERED');
    }
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

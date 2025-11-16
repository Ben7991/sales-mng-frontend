import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  OnDestroy
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { UpdatePaymentModalComponent } from './components/update-payment-modal/update-payment-modal.component';
import { OrderDetailsCanvasComponent } from './components/order-details-canvas/order-details-canvas.component';
import { CreateOrderModalComponent } from './components/create-order-modal/create-order-modal.component';
import { TableComponent } from '@shared/components/user-management/table/table.component';
import { SearchComponent } from '@shared/components/search/search.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { MatDivider } from '@angular/material/divider';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { getUpdateOrderPaymentUrl } from '@shared/constants/api.constants';
import { STATUS_COLORS } from '@shared/constants/colors.constant';
import { salesSearchConfig, salesTableActions, salesTableColumns } from './constants/sales.data';
import { SalesService } from './service/sales.service';
import { CustomerManagementService } from '../../../customers/services/customer-management.service';
import { StatusConfig, TableAction, TableColumn } from '@shared/components/user-management/table/interface/interface';
import { SalesOrder } from './models/interface';
import { Customer } from '../../../customers/models/interface';

@Component({
  selector: 'app-sales-management',
  templateUrl: './sales-management.component.html',
  styleUrls: ['./sales-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    MatDivider,
    MatIconModule,
    MatMenu,
    MatMenuItem,
    SearchComponent,
    MatMenuTrigger,
    MatProgressSpinner,
    OrderDetailsCanvasComponent,
    TableComponent
  ]
})
export class SalesManagementComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly salesService = inject(SalesService);
  private readonly customerService = inject(CustomerManagementService);

  public readonly isLoadingCustomers = this.customerService.isLoadingCustomers;
  public readonly isLoading$ = this.salesService.isLoadingOrders;
  public readonly customers = this.customerService.customers;

  public readonly activeCustomerId = signal<number | null>(null);
  public readonly clickedRow = signal<SalesOrder | null>(null);
  public readonly searchTerm = signal<string>('');
  public readonly currentPage = signal(0);
  public readonly currentPerPage = signal(10);

  public readonly salesSearchConfig = salesSearchConfig;
  public readonly statusConfig: StatusConfig = {
    Outstanding: STATUS_COLORS.QUIT,
    Paid: STATUS_COLORS.ACTIVE,
    Open: STATUS_COLORS.ACTIVE,
    Delivered: STATUS_COLORS.INACTIVE
  };

  tableActions: TableAction[] = salesTableActions;
  tableColumns: TableColumn[] = salesTableColumns;

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.customerService.getCustomers();

    this.subscriptions.push(
      this.route.queryParamMap.subscribe(params => {
        const q = params.get('q') || '';
        this.searchTerm.set(q);
        this.salesService.searchQuery = q;
        this.salesService.getOrders({ page: this.currentPage(), perPage: this.currentPerPage(), q }, { useCache: !q });
      })
    );

  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onUserSearchTermChange(term: string) {
    this.searchTerm.set(term);
    this.salesService.searchQuery = term;
    this.currentPage.set(0);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: term || null },
      queryParamsHandling: 'merge'
    });
  }

  filterBySupplier(supplier: Customer | null) {
    const q = supplier?.name || '';
    this.activeCustomerId.set(supplier?.id ?? null);
    this.searchTerm.set(q);
    this.currentPage.set(0);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: q || null },
      queryParamsHandling: 'merge'
    });

    this.salesService.getOrders({ page: 0, perPage: this.currentPerPage(), q });
  }


  filterStatus(status: string) {
    this.searchTerm.set(status);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: status || null },
      queryParamsHandling: 'merge'
    });

    this.salesService.getOrders({ page: 0, perPage: this.currentPerPage(), q: status });
  }

  onRowItemClick(row: SalesOrder) {
    this.clickedRow.set(row);
  }

  clearClickedRowItem() {
    this.clickedRow.set(null);
  }

  onActionClick(event: { action: string; item: any; originalEvent?: Event }) {
    if (event.originalEvent) {
      event.originalEvent.stopPropagation();
    }
    if (event.action === 'edit') this.salesService.changeOrderStatusAndRefresh(event.item.id, 'DELIVERED');
  }

  openCreateOrderModal() {
    const dialogRef = this.dialog.open(CreateOrderModalComponent, {
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90%',
      disableClose: false,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.salesService.getOrders();
    });
  }

  openUpdatePaymentModal(orderId: number) {
    const dialogRef = this.dialog.open(UpdatePaymentModalComponent, {
      width: '350px',
      maxWidth: '90vw',
      data: { orderId },
      disableClose: false,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.http.post(getUpdateOrderPaymentUrl(orderId), result).subscribe(() => this.salesService.getOrders());
    });
  }

  onPageChange(event: PageEvent) {
    this.salesService.currentPage = event.pageIndex;
    this.salesService.currentPageSize = event.pageSize;
    this.salesService.getOrders({ page: event.pageIndex, perPage: event.pageSize });
  }

  onSearchCleared() {
    this.searchTerm.set('');
    this.salesService.searchQuery = '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: null },
      queryParamsHandling: 'merge'
    });
    this.salesService.getOrders({ page: this.currentPage(), perPage: this.currentPerPage(), q: '' });
  }

}

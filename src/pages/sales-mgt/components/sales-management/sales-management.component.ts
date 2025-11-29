import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SearchComponent } from '@shared/components/search/search.component';
import { StatusConfig, TableColumn } from '@shared/components/user-management/table/interface/interface';
import { TableComponent } from '@shared/components/user-management/table/table.component';
import { getUpdateOrderPaymentUrl } from '@shared/constants/api.constants';
import { STATUS_COLORS } from '@shared/constants/colors.constant';
import { Customer } from '../../../customers/models/interface';
import { CustomerManagementService } from '../../../customers/services/customer-management.service';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { CreateOrderModalComponent } from './components/create-order-modal/create-order-modal.component';
import { OrderDetailsCanvasComponent } from './components/order-details-canvas/order-details-canvas.component';
import { UpdatePaymentModalComponent } from './components/update-payment-modal/update-payment-modal.component';
import { salesSearchConfig, salesTableColumns } from './constants/sales.data';
import { OrderStatus, SalesOrder } from './models/interface';
import { SalesService } from './service/sales.service';

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
    // Payment statuses
    Outstanding: STATUS_COLORS.ORANGE,
    Paid: STATUS_COLORS.GREEN,

    // Order statuses
    Open: STATUS_COLORS.GREEN,
    'Deemed Satisfied': STATUS_COLORS.ORANGE,
    Delivered: STATUS_COLORS.RED,
    Cancelled: STATUS_COLORS.GREY
  };

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

    const order = event.item;

    switch (event.action) {
      case 'edit':
        this.openEditOrderModal(order);
        break;
      case 'mark-delivered':
        this.confirmAndMarkAsDelivered(order.id);
        break;
      case 'deemed-satisfied':
        this.changeOrderStatus(order.id, 'DEEMED_SATISFIED');
        break;
      case 'cancel':
        this.changeOrderStatus(order.id, 'CANCELLED');
        break;
      case 'reopen':
        this.changeOrderStatus(order.id, 'OPEN');
        break;
      case 'change-status':
        // Handled by submenu actions
        break;
      default:
        break;
    }
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

  openEditOrderModal(order: SalesOrder) {
    // Fetch full order details before opening modal
    this.salesService.getSingleOrder(order.id).subscribe(({ data }) => {
      // Ensure customer is present from the row data if missing in detailed data
      const fullOrderData = {
        ...data,
        customer: order.customer,
        comment: data.commenet
      };

      const dialogRef = this.dialog.open(CreateOrderModalComponent, {
        width: '700px',
        maxWidth: '90vw',
        maxHeight: '90%',
        disableClose: false,
        panelClass: 'custom-dialog-container',
        data: { order: fullOrderData }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) this.salesService.getOrders();
      });
    });
  }

  confirmAndMarkAsDelivered(orderId: number) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '450px',
      maxWidth: '90vw',
      data: {
        title: 'Confirm Action',
        message: 'Confirm marking order as delivered. <b>NB: this is irreversible.</b>',
        confirmText: 'Confirm',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.changeOrderStatus(orderId, 'DELIVERED');
      }
    });
  }

  changeOrderStatus(orderId: number, status: OrderStatus) {
    this.salesService.changeOrderStatus(orderId, status).subscribe();
  }

  openUpdatePaymentModal(orderId: number) {
    const dialogRef = this.dialog.open(UpdatePaymentModalComponent, {
      width: 'auto',
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

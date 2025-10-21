import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { SnackbarService } from '@shared/services/snackbar/snackbar.service';
import { TOAST_MESSAGES } from '@shared/constants/general.constants';
import { APISalesOrderResponse, CreateOrderRequest, salesOrder } from '../models/interface';
import { changeOrderStatusUrl, getSalesOrdersUrl } from '@shared/constants/api.constants';

const DEFAULT_SALES_ORDER_FETCH_OPTIONS: { useCache?: boolean, showLoader?: boolean } = {
  useCache: false,
  showLoader: true
};

const SALES_ORDERS_PAGE_SIZE = 10;

interface SalesOrderApiParams {
  perPage?: number;
  page?: number;
  q?: string;
  orderStatus?: string;
  paidStatus?: string;
}

export class SalesOrderTableDataAdapter {
  static adaptForTable(orders: salesOrder[]): any[] {
    return orders.map(order => ({
      ...order,
      orderStatus: order.orderStatus.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      paidStatus: order.paidStatus.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    }));
  }
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private readonly http = inject(HttpClient);
  private readonly snackbarService = inject(SnackbarService);

  public readonly isLoadingOrders = signal(false);
  public readonly isCreatingOrder = signal(false);

  public readonly salesOrderResponse = signal<APISalesOrderResponse | null>(null);
  public readonly orders = computed(() => this.salesOrderResponse()?.data ? SalesOrderTableDataAdapter.adaptForTable(this.salesOrderResponse()!.data) : null);
  public readonly ordersCount = computed(() => this.salesOrderResponse()?.count ?? 0);

  public searchQuery = '';
  public currentPage = 0;
  public currentPageSize = SALES_ORDERS_PAGE_SIZE;

  public getOrders(
    params?: SalesOrderApiParams,
    { useCache, showLoader } = DEFAULT_SALES_ORDER_FETCH_OPTIONS
  ): void {
    if (useCache && this.salesOrderResponse()) {
      return;
    }

    this.isLoadingOrders.set(showLoader ?? true);

    let httpParams = new HttpParams();

    if (params) {
      if (params.perPage !== undefined) {
        httpParams = httpParams.set('perPage', params.perPage.toString());
        this.currentPageSize = params.perPage;
      }
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
        this.currentPage = params.page;
      }
      if (params.q !== undefined && params.q !== '') {
        httpParams = httpParams.set('q', params.q);
      }
      if (params.orderStatus !== undefined && params.orderStatus !== '') {
        httpParams = httpParams.set('orderStatus', params.orderStatus);
      }
      if (params.paidStatus !== undefined && params.paidStatus !== '') {
        httpParams = httpParams.set('paidStatus', params.paidStatus);
      }
    }
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      httpParams = httpParams.set('q', this.searchQuery.trim());
    }

    this.http.get<APISalesOrderResponse>(getSalesOrdersUrl, { params: httpParams })
      .pipe(
        tap((response) => {
          this.salesOrderResponse.set(response);
        }),
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);

          return EMPTY;
        }),
        finalize(() => this.isLoadingOrders.set(false))
      )
      .subscribe()
  }

  public createOrder(payload: CreateOrderRequest) {
    this.isCreatingOrder.set(true);

    return this.http.post<salesOrder>(getSalesOrdersUrl, payload).pipe(
      tap((order) => {
        this.snackbarService.showSuccess("Order created successfully");

        this.salesOrderResponse.update((response) => {
          if (!response) {
            return { data: [order], count: 1 } as APISalesOrderResponse;
          }
          return {
            ...response,
            data: [order, ...response.data],
            count: response.count + 1,
          };
        });
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
        this.snackbarService.showError(msg);
        return EMPTY;
      }),
      finalize(() => this.isCreatingOrder.set(false))
    );
  }

  public changeOrderStatusAndRefresh(orderId: string | number, newStatus: string): void {
    this.http
      .patch(changeOrderStatusUrl(orderId), { status: newStatus })
      .pipe(
        tap(() => {
          this.snackbarService.showSuccess('Order status updated successfully');
          this.getOrders();
        }),
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);
          return EMPTY;
        })
      )
      .subscribe();
  }
}

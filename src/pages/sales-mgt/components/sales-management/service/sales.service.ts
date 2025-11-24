import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { changeOrderStatusUrl, getOrderUrl, getSalesReceiptDataUrl, getSalesOrdersUrl, updateOrderUrl, changeOrderStatusPatchUrl } from '@shared/constants/api.constants';
import { TOAST_MESSAGES } from '@shared/constants/general.constants';
import { ReportDownloadService } from '@shared/services/report-download/report-download.service';
import { SnackbarService } from '@shared/services/snackbar/snackbar.service';
import { catchError, EMPTY, finalize, Observable, tap } from 'rxjs';
import { APISalesOrderResponse, CreateOrderRequest, SalesOrder, UpdateOrderRequest } from '../models/interface';

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
  static adaptForTable(orders: SalesOrder[]): any[] {
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
  private readonly reportDownloadService = inject(ReportDownloadService);

  public readonly isLoadingOrders = signal(false);
  public readonly isLoadingSingleOrder = signal(false);
  public readonly singleOrderLoadingError = signal(false);
  public readonly isCreatingOrder = signal(false);

  public readonly salesOrderResponse = signal<APISalesOrderResponse | null>(null);
  public readonly singleOrder = signal<any>(null);
  public readonly orders = computed(() => this.salesOrderResponse()?.data ? SalesOrderTableDataAdapter.adaptForTable(this.salesOrderResponse()!.data) : null);
  public readonly ordersCount = computed(() => this.salesOrderResponse()?.count ?? 0);

  public searchQuery = '';
  public currentPage = 0;
  public currentPageSize = SALES_ORDERS_PAGE_SIZE;

  public getSingleOrder(orderId: number): Observable<{ data: SalesOrder }> {
    this.isLoadingSingleOrder.set(true);
    this.singleOrderLoadingError.set(false);

    return this.http.get<any>(getOrderUrl(orderId))
      .pipe(
        tap(({ data }) => {
          this.singleOrder.set(data);
        }),
        catchError(() => {
          this.singleOrderLoadingError.set(true);
          return EMPTY;
        }),
        finalize(() => this.isLoadingSingleOrder.set(false))
      );
  }

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
      if (params.perPage) {
        httpParams = httpParams.set('perPage', params.perPage.toString());
        this.currentPageSize = params.perPage;
      }
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
        this.currentPage = params.page;
      }
      if (params.q && params.q !== '') {
        httpParams = httpParams.set('q', params.q);
      }
      if (params.orderStatus && params.orderStatus !== '') {
        httpParams = httpParams.set('orderStatus', params.orderStatus);
      }
      if (params.paidStatus && params.paidStatus !== '') {
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

    return this.http.post<SalesOrder>(getSalesOrdersUrl, payload).pipe(
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

  public updateOrder(orderId: number, payload: UpdateOrderRequest) {
    return this.http.put<SalesOrder>(updateOrderUrl(orderId), payload).pipe(
      tap(() => {
        this.snackbarService.showSuccess("Order updated successfully");
        this.getOrders();
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
        this.snackbarService.showError(msg);
        return EMPTY;
      })
    );
  }

  public changeOrderStatus(orderId: number, status: 'DEEMED_SATISFIED' | 'DELIVERED'): Observable<any> {
    return this.http.patch(changeOrderStatusPatchUrl(orderId), { status }).pipe(
      tap(() => {
        this.snackbarService.showSuccess('Order status updated successfully');
        this.getOrders();
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
        this.snackbarService.showError(msg);
        return EMPTY;
      })
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
  public downloadOrPrintReceipt(orderId: number, action: 'download' | 'print'): Observable<any> {
    const errMsg = `Failed to ${action === 'print' ? 'print' : 'download'} receipt`;

    return this.http.get<any>(getSalesReceiptDataUrl(orderId))
      .pipe(
        tap((reportData) => {
          try {
            if (action === 'print') {
              this.reportDownloadService.printReceipt(reportData);
            } else {
              const filename = `Sales Receipt - ${new Date().toUTCString()}.pdf`;
              this.reportDownloadService.downloadReceipt(reportData, filename);
            }
          } catch {
            this.snackbarService.showError(errMsg);
          }
        }),
        catchError(() => {
          this.snackbarService.showError(errMsg);
          return EMPTY;
        })
      );
  }
}

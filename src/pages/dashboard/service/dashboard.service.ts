import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, tap, finalize } from 'rxjs';
import { SnackbarService } from '@shared/services/snackbar/snackbar.service';
import {
  DashboardSummaryResponse,
  HighValueCustomersResponse,
  OrderSummaryResponse
} from '../models/interface';
import {
  getHighValueCustomersUrl,
  getOrderSummaryUrl,
  getSummaryUrl
} from '@shared/constants/api.constants';

const DEFAULT_FETCH_OPTIONS: { useCache?: boolean; showLoader?: boolean } = {
  useCache: false,
  showLoader: true
};

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private snackbarService = inject(SnackbarService);

  private readonly dashboardSummary = signal<DashboardSummaryResponse | null>(null);
  private readonly orderSummary = signal<OrderSummaryResponse | null>(null);
  private readonly highValueCustomers = signal<HighValueCustomersResponse | null>(null);

  public readonly isLoadingDashboard = computed(() =>
    this.isLoadingDashboardSummary()
  );
  public readonly isLoadingDashboardSummary = signal(false);
  public readonly isLoadingOrderSummary = signal(false);
  public readonly isLoadingHighValueCustomers = signal(false);


  public readonly dashboardSummary$ = computed(() => this.dashboardSummary());
  public readonly orderSummary$ = computed(() => this.orderSummary());
  public readonly highValueCustomers$ = computed(() => this.highValueCustomers());


  public getDashboardSummary({ useCache, showLoader } = DEFAULT_FETCH_OPTIONS): void {
    if (useCache && this.dashboardSummary()) return;

    this.isLoadingDashboardSummary.set(showLoader ?? true);

    this.http
      .get<DashboardSummaryResponse>(getSummaryUrl)
      .pipe(
        tap((res) => this.dashboardSummary.set(res)),
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message ?? 'Failed to fetch dashboard summary.';
          this.snackbarService.showError(msg);
          return EMPTY;
        }),
        finalize(() => this.isLoadingDashboardSummary.set(false))
      )
      .subscribe();
  }

  public getOrderSummary(year: string, { useCache, showLoader } = DEFAULT_FETCH_OPTIONS): void {
    if (useCache && this.orderSummary()) return;

    this.isLoadingOrderSummary.set(showLoader ?? true);

    const params = new HttpParams().set('year', year);

    this.http
      .get<OrderSummaryResponse>(getOrderSummaryUrl, { params })
      .pipe(
        tap((res) => this.orderSummary.set(res)),
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message ?? 'Failed to fetch order summary.';
          this.snackbarService.showError(msg);
          return EMPTY;
        }),
        finalize(() => this.isLoadingOrderSummary.set(false))
      )
      .subscribe();
  }

  public getHighValueCustomers(month: string, { useCache, showLoader } = DEFAULT_FETCH_OPTIONS): void {

    if (useCache && this.highValueCustomers()) return;

    this.isLoadingHighValueCustomers.set(showLoader ?? true);

    const params = new HttpParams().set('month', month);

    this.http
      .get<HighValueCustomersResponse>(getHighValueCustomersUrl, { params })
      .pipe(
        tap((res) => this.highValueCustomers.set(res)),
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message ?? 'Failed to fetch high-value customers.';
          this.snackbarService.showError(msg);
          return EMPTY;
        }),
        finalize(() => this.isLoadingHighValueCustomers.set(false))
      )
      .subscribe();
  }

}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, catchError, EMPTY, finalize, tap } from 'rxjs';

import { SnackbarService } from '@shared/services/snackbar/snackbar.service';
import { TOAST_MESSAGES } from '@shared/constants/general.constants';
import {ArrearDetail, Customer, GetArrearDetailsApiResponse, GetArrearsApiResponse} from '../models/types';
import {ARREARS_PAGE_SIZE} from '../constants/arrears.data';
import {getArrearDetailsUrl, getArrearsUrl} from '@shared/constants/api.constants';


const DEFAULT_ARREARS_FETCH_OPTIONS: { useCache?: boolean, showLoader?: boolean } = {
  useCache: false,
  showLoader: true
};

@Injectable({
  providedIn: 'root'
})
export class ArrearsService {
  private readonly http = inject(HttpClient);
  private readonly snackbarService = inject(SnackbarService);

  public readonly customerArrears = signal<Customer[] | null>(null);
  public readonly customerArrearsCount = signal<number>(0);
  public readonly isLoadingArrears = signal(false);

  public readonly selectedCustomerArrearDetails = signal<ArrearDetail[] | null>(null);
  public readonly isLoadingArrearDetails = signal(false);


  public searchQuery = '';
  public currentPage = 0;
  public currentPageSize = ARREARS_PAGE_SIZE;


  public getCustomerArrears(
    { useCache, showLoader } = DEFAULT_ARREARS_FETCH_OPTIONS
  ): void {
    if (useCache && this.customerArrears()) {
      return;
    }

    this.isLoadingArrears.set(showLoader ?? true);
    this.http.get<GetArrearsApiResponse>(
      getArrearsUrl(this.currentPageSize, this.currentPage, this.searchQuery)
    )
      .pipe(
        tap((response) => {
          this.customerArrears.set(response.data);
          this.customerArrearsCount.set(response.count);
        }),
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);

          return EMPTY;
        }),
        finalize(() => this.isLoadingArrears.set(false))
      )
      .subscribe();
  }


  public getArrearDetails(customerId: number): Observable<GetArrearDetailsApiResponse> {
    this.isLoadingArrearDetails.set(true);
    this.selectedCustomerArrearDetails.set(null);

    return this.http.get<GetArrearDetailsApiResponse>(
      getArrearDetailsUrl(customerId)
    )
      .pipe(
        tap((response) => {
          this.selectedCustomerArrearDetails.set(response.data);
        }),
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message || 'Failed to fetch arrear details.';
          this.snackbarService.showError(msg);
          this.selectedCustomerArrearDetails.set([]);
          return EMPTY;
        }),
        finalize(() => this.isLoadingArrearDetails.set(false))
      );
  }
}

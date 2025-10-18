import {computed, inject, Injectable, signal} from '@angular/core';
import {UserApiParams} from '@shared/models/interface';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {SnackbarService} from '@shared/services/snackbar/snackbar.service';
import {inventoryResponse} from '../../model/interface';
import {catchError, EMPTY, finalize, tap} from 'rxjs';
import {getStockHistoryUrl} from '@shared/constants/api.constants';
import {INVENTORY_PAGE_SIZE} from '../../inventory/constant/inventory.const';

const DEFAULT_HISTORY_FETCH_OPTIONS: { useCache?: boolean, showLoader?: boolean } = {
  useCache: false,
  showLoader: true
};

@Injectable({
  providedIn: 'root'
})
export class HistoryServiceService {
  private http = inject(HttpClient);
  private readonly snackbarService = inject(SnackbarService);

  public readonly historyResponse = signal<inventoryResponse | null>(null);
  public readonly stockHistory$ = computed(() => this.historyResponse()?.data ?? []);
  public readonly totalHistory$ = computed(() => this.historyResponse()?.count ?? 0);

  public readonly isLoadingHistory = signal(false);
  public searchQuery = '';

  public currentHistoryPage:  number = 0;
  public currentHistoryPerPage:  number = INVENTORY_PAGE_SIZE;


  public getAllStockHistory(
    params?: UserApiParams,
    {useCache, showLoader} = DEFAULT_HISTORY_FETCH_OPTIONS
  ): void {
    if (useCache && this.historyResponse()) {
      return;
    }
    this.isLoadingHistory.set(showLoader ?? true);

    let httpParams = new HttpParams();

    if (params) {
      if (params.perPage !== undefined) {
        httpParams = httpParams.set('perPage', params.perPage.toString());
        this.currentHistoryPerPage = params.perPage as number;
      }
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
        this.currentHistoryPage = params.page as number;
      }
      if (params.q !== undefined && params.q !== '') {
        httpParams = httpParams.set('q', params.q);
      }
    }
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      httpParams = httpParams.set('q', this.searchQuery.trim());
    }

    this.http
      .get<inventoryResponse>(getStockHistoryUrl, { params: httpParams })
      .pipe(
        tap((response) => {
          this.historyResponse.set(response);
        }),
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message ?? 'An error occurred while fetching stock history.';
          this.snackbarService.showError(msg);
          return EMPTY;
        }),
        finalize(() => this.isLoadingHistory.set(false))
      )
      .subscribe();
  }
}

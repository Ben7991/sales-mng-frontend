import {computed, inject, Injectable, signal} from '@angular/core';
import {UserApiParams} from '@shared/models/interface';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {SnackbarService} from '@shared/services/snackbar/snackbar.service';
import {AddInventoryInterface, inventoryResponse} from '../../model/interface';
import {addInventoryUrl, getInventoryUrl, updateInventoryUrl} from '@shared/constants/api.constants';
import {catchError, EMPTY, finalize, tap} from 'rxjs';
import {INVENTORY_PAGE_SIZE} from '../constant/inventory.const';

const DEFAULT_USER_FETCH_OPTIONS: { useCache?: boolean, showLoader?: boolean } = {
  useCache: false,
  showLoader: true
};

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private readonly snackbarService = inject(SnackbarService);
  public readonly inventoryResponse = signal<inventoryResponse | null>(null);
  public readonly Inventories$ = computed(() => this.inventoryResponse()?.data ?? []);
  public readonly totalInventory$ = computed(() => this.inventoryResponse()?.count ?? 0);

  public readonly isLoadingInventory = signal(false);
  public searchQuery = '';

  public currentInventoryPage = 0;
  public currentInventoryPerPage = INVENTORY_PAGE_SIZE;



  public getAllInventory(
    params?: UserApiParams & { role?: string; status?: string },
    {useCache, showLoader} = DEFAULT_USER_FETCH_OPTIONS
  ): void {
    if (useCache && this.inventoryResponse()) {
      return;
    }
    this.isLoadingInventory.set(showLoader ?? true);

    let httpParams = new HttpParams();

    if (params) {
      if (params.perPage !== undefined) {
        httpParams = httpParams.set('perPage', params.perPage.toString());
      }
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.q !== undefined && params.q !== '') {
        httpParams = httpParams.set('q', params.q);
      }
      if (params.role !== undefined && params.role !== '') {
        httpParams = httpParams.set('role', params.role);
      }
      if (params.status !== undefined && params.status !== '') {
        httpParams = httpParams.set('status', params.status);
      }
    }
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      httpParams = httpParams.set('q', this.searchQuery.trim());
    }

    this.http
      .get<inventoryResponse>(getInventoryUrl, { params: httpParams })
      .pipe(
        tap((response) => {
          this.inventoryResponse.set(response);
        }),
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message ?? 'An error occurred while fetching users.';
          this.snackbarService.showError(msg);
          return EMPTY;
        }),
        finalize(() => this.isLoadingInventory.set(false))
      )
      .subscribe();
  }

  public addInventory(inventoryData: AddInventoryInterface): void {
    this.http.post<any>(
      addInventoryUrl,
      inventoryData
    ).pipe(
        finalize(() => {
          this.isLoadingInventory.set(false)
        }),
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message ?? 'Failed to add inventory.';
          this.snackbarService.showError(msg);
          return EMPTY;
        })
      )
      .subscribe({
        next: () => {
          this.getAllInventory({
            page: this.currentInventoryPage,
            perPage: this.currentInventoryPerPage,
            q: this.searchQuery
          }, { showLoader: false, useCache: false });

          this.snackbarService.showSuccess('Product restocked successfully');
        }
      });
  }

  public updateInventory(inventoryId: number, inventoryData: AddInventoryInterface): void {
    this.isLoadingInventory.set(true);
    this.http.patch<any>(
      updateInventoryUrl(inventoryId),
      inventoryData
    ).pipe(
      finalize(() => {
        this.isLoadingInventory.set(false)
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = err.error?.message ?? `Failed to update inventory ID ${inventoryId}.`;
        this.snackbarService.showError(msg);
        return EMPTY;
      })
    )
      .subscribe({
        next: () => {
          this.getAllInventory({
            page: this.currentInventoryPage,
            perPage: this.currentInventoryPerPage,
            q: this.searchQuery
          }, { showLoader: false, useCache: false });

          this.snackbarService.showSuccess(`Inventory ID ${inventoryId} updated successfully`);
        }
      });
  }
}

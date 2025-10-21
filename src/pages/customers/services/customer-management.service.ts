import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  getCustomersUrl,
  customerBasicInfoUpdateUrl,
  customerContactAdditionUrl,
  customerContactDeletionUrl,
  customerLiveSearchUrl
} from '@shared/constants/api.constants';
import { TOAST_MESSAGES } from '@shared/constants/general.constants';
import { SnackbarService } from '@shared/services/snackbar/snackbar.service';
import { catchError, EMPTY, finalize, forkJoin, Observable, tap } from 'rxjs';
import {
  AddPhoneInterface,
  AddCustomerApiResponse,
  AddCustomerInterface,
  GetCustomerApiResponse,
  Customer,
  UpdateCustomerInterface,
  LiveSearchCustomerResponse
} from '../models/interface';
import { CUSTOMERS_PAGE_SIZE } from '../constants/customer.constant';

export class CustomerTableDataAdapter {
  static adaptForTable(customers: Customer[]): any[] {
    return customers.map(customer => ({
      ...customer,
      phone: this.formatPhoneDisplay(customer.customerPhones)
    }));
  }

  private static formatPhoneDisplay(phones: { phone: string }[]): string {
    if (phones.length === 0) return 'No phone';
    if (phones.length === 1) return phones[0].phone;
    return `${phones[0].phone} (+${phones.length - 1} more)`;
  }
}

const DEFAULT_CUSTOMER_FETCH_OPTIONS: { useCache?: boolean, showLoader?: boolean } = {
  useCache: false,
  showLoader: true
};

@Injectable({
  providedIn: 'root'
})
export class CustomerManagementService {
  private readonly http = inject(HttpClient);
  private readonly snackbarService = inject(SnackbarService);

  public readonly customers = signal<Customer[] | null>(null);
  public readonly customersCount = signal<number>(0);
  public readonly isLoadingCustomers = signal(false);

  public searchQuery = '';
  public currentPage = 0;
  public currentPageSize = CUSTOMERS_PAGE_SIZE;

  public getCustomers({ useCache, showLoader } = DEFAULT_CUSTOMER_FETCH_OPTIONS): void {
    if (useCache && this.customers()) {
      return;
    }

    this.isLoadingCustomers.set(showLoader ?? true);
    this.http.get<GetCustomerApiResponse>(
      getCustomersUrl(this.currentPageSize, this.currentPage, this.searchQuery)
    )
      .pipe(
        tap((response) => {
          this.customers.set(
            CustomerTableDataAdapter.adaptForTable(response.data)
          );
          this.customersCount.set(response.count);
        }),
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);

          return EMPTY;
        }),
        finalize(() => this.isLoadingCustomers.set(false))
      )
      .subscribe()
  }

  public addCustomer(customerData: AddCustomerInterface): void {
    this.http.post<AddCustomerApiResponse>(
      getCustomersUrl(this.currentPageSize, this.currentPage, this.searchQuery),
      customerData
    )
      .subscribe({
        next: () => {
          this.getCustomers({ showLoader: false, useCache: false });
          this.snackbarService.showSuccess('Customer added successfully');
        },
        error: (err: HttpErrorResponse) => {
          this.snackbarService.showError(err.error?.message || 'Failed to add customer');
        }
      });
  }

  public updateCustomer(customerId: number, customerData: any): void {
    const updates: Observable<any>[] = [];

    if (customerData.basicInfo) {
      updates.push(this.updateBasicInfo(customerId, customerData.basicInfo));
    }

    if (customerData.phonesToAdd?.length > 0) {
      const phoneUpdates = customerData.phonesToAdd.map((phone: string) =>
        this.addPhone(customerId, { phone })
      );
      updates.push(...phoneUpdates);
    }

    if (customerData.phonesToDelete?.length > 0) {
      const phoneDeletes = customerData.phonesToDelete.map((phoneId: number) =>
        this.deletePhone(customerId, phoneId)
      );
      updates.push(...phoneDeletes);
    }

    const obs = (updates.length > 0) ? forkJoin(updates) : new Observable(observer => observer.next({}));
    obs.subscribe({
      next: () => {
        this.getCustomers({ useCache: false, showLoader: false });
        this.snackbarService.showSuccess('Customer updated successfully');
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.showError(err.error?.message || 'Failed to update customer');
      }
    })
  }

  public searchCustomers(query: string): Observable<LiveSearchCustomerResponse> {
    return this.http.get<LiveSearchCustomerResponse>(
      customerLiveSearchUrl(query)
    );
  }

  private updateBasicInfo(customerId: number, basicInfo: UpdateCustomerInterface): Observable<any> {
    return this.http.patch(customerBasicInfoUpdateUrl(customerId), basicInfo);
  }

  private addPhone(customerId: number, phoneData: AddPhoneInterface): Observable<any> {
    return this.http.post(customerContactAdditionUrl(customerId), phoneData);
  }

  private deletePhone(customerId: number, phoneId: number): Observable<any> {
    return this.http.delete(customerContactDeletionUrl(customerId, phoneId));
  }
}
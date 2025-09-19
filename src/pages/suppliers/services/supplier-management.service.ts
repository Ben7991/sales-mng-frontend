import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { supplierBasicInfoUpdateUrl, supplierContactAdditionUrl, supplierContactDeletionUrl, SUPPLIERS_URL, supplierStatusChangeUrl } from '@shared/constants/api.constants';
import { TOAST_MESSAGES } from '@shared/constants/general.constants';
import { SnackbarService } from '@shared/services/snackbar/snackbar.service';
import { catchError, EMPTY, finalize, forkJoin, Observable, tap } from 'rxjs';
import { AddPhoneInterface, AddSupplierApiResponse, AddSupplierInterface, ChangeStatusInterface, Supplier, SupplierArrayResponse, UpdateSupplierInterface } from '../models/interface';

export class SupplierTableDataAdapter {
  static adaptForTable(suppliers: Supplier[]): any[] {
    return suppliers.map(supplier => ({
      ...supplier,
      phone: this.formatPhoneDisplay(supplier.supplierPhones),
      status: supplier.status === 'ACTIVE' ? 'Active' : 'Inactive'
    }));
  }

  private static formatPhoneDisplay(phones: { phone: string }[]): string {
    if (phones.length === 0) return 'No phone';
    if (phones.length === 1) return phones[0].phone;
    return `${phones[0].phone} (+${phones.length - 1} more)`;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SupplierManagementService {
  private readonly http = inject(HttpClient);
  private readonly snackbarService = inject(SnackbarService);

  public readonly suppliers = signal<Supplier[] | null>(null);
  public readonly isLoadingSuppiers = signal(false);

  public getASuppliers(): void {
    if (this.suppliers()) {
      return;
    }

    this.isLoadingSuppiers.set(true)
    this.http.get<SupplierArrayResponse>(SUPPLIERS_URL)
      .pipe(
        tap((response) => {
          this.suppliers.set(
            SupplierTableDataAdapter.adaptForTable(response.data.data)
          );
        }),
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);

          return EMPTY;
        }),
        finalize(() => this.isLoadingSuppiers.set(false))
      )
      .subscribe()
  }

  public addSupplier(supplierData: AddSupplierInterface): void {
    this.http.post<AddSupplierApiResponse>(SUPPLIERS_URL, supplierData)
      .pipe(

    )
      .subscribe({
        next: ({ data }) => {
          this.suppliers.update(suppliers => suppliers ? [data!, ...suppliers] : [data!]);
          this.snackbarService.showSuccess('Supplier added successfully');
        },
        error: (err: HttpErrorResponse) => {
          this.snackbarService.showError(err.error?.message || 'Failed to add supplier');
        }
      });
  }

  public updateSupplier(supplierId: number, supplierData: any): void {
    const updates: Observable<any>[] = [];

    if (supplierData.basicInfo) {
      updates.push(this.updateBasicInfo(supplierId, supplierData.basicInfo));
    }

    if (supplierData.status) {
      updates.push(this.changeStatus(supplierId, supplierData.status));
    }

    if (supplierData.phonesToAdd?.length > 0) {
      const phoneUpdates = supplierData.phonesToAdd.map((phone: string) =>
        this.addPhone(supplierId, { phone })
      );
      updates.push(...phoneUpdates);
    }

    if (supplierData.phonesToDelete?.length > 0) {
      const phoneDeletes = supplierData.phonesToDelete.map((phoneId: number) =>
        this.deletePhone(supplierId, phoneId)
      );
      updates.push(...phoneDeletes);
    }

    const obs = (updates.length > 0) ? forkJoin(updates) : new Observable(observer => observer.next({}));
    obs.subscribe({
      next: () => {
        this.getASuppliers();
        this.snackbarService.showSuccess('Supplier updated successfully');
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.showError(err.error?.message || 'Failed to update supplier');
      }
    })
  }

  private updateBasicInfo(supplierId: number, basicInfo: UpdateSupplierInterface): Observable<any> {
    return this.http.patch(supplierBasicInfoUpdateUrl(supplierId), basicInfo);
  }

  private changeStatus(supplierId: number, status: ChangeStatusInterface): Observable<any> {
    return this.http.patch(supplierStatusChangeUrl(supplierId), status);
  }

  private addPhone(supplierId: number, phoneData: AddPhoneInterface): Observable<any> {
    return this.http.post(supplierContactAdditionUrl(supplierId), phoneData);
  }

  private deletePhone(supplierId: number, phoneId: number): Observable<any> {
    return this.http.delete(supplierContactDeletionUrl(supplierId, phoneId));
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { AddPhoneInterface, AddSupplierApiResponse, AddSupplierInterface, ChangeStatusInterface, SupplierArrayResponse, UpdateSupplierInterface } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class SupplierManagementService {
  private readonly http = inject(HttpClient);
  private readonly SUPPLIERS_URL = 'https://api.jofakenterprise.com/suppliers';

  public getAllSuppliers(): Observable<SupplierArrayResponse> {
    return this.http.get<SupplierArrayResponse>(this.SUPPLIERS_URL);
  }

  public addSupplier(supplierData: AddSupplierInterface): Observable<AddSupplierApiResponse> {
    return this.http.post<AddSupplierApiResponse>(this.SUPPLIERS_URL, supplierData);
  }

  public updateSupplier(supplierId: number, supplierData: any): Observable<any> {
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

    return updates.length > 0 ? forkJoin(updates) : new Observable(observer => observer.next({}));
  }

  private updateBasicInfo(supplierId: number, basicInfo: UpdateSupplierInterface): Observable<any> {
    return this.http.patch(`${this.SUPPLIERS_URL}/${supplierId}`, basicInfo);
  }

  private changeStatus(supplierId: number, status: ChangeStatusInterface): Observable<any> {
    return this.http.patch(`${this.SUPPLIERS_URL}/${supplierId}/change-status`, status);
  }

  private addPhone(supplierId: number, phoneData: AddPhoneInterface): Observable<any> {
    return this.http.post(`${this.SUPPLIERS_URL}/${supplierId}/phone`, phoneData);
  }

  private deletePhone(supplierId: number, phoneId: number): Observable<any> {
    return this.http.delete(`${this.SUPPLIERS_URL}/${supplierId}/phone/${phoneId}`);
  }

  public deleteSupplier(supplierId: number): Observable<any> {
    return this.http.delete(`${this.SUPPLIERS_URL}/${supplierId}`);
  }
}
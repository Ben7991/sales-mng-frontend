import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ModalService } from '@shared/components/modal/service/modal.service';
import { SearchConfig } from '@shared/components/search/interface';
import { SearchComponent } from '@shared/components/search/search.component';
import { TableAction, TableColumn } from '@shared/components/user-management/table/interface/interface';
import { TableComponent } from '@shared/components/user-management/table/table.component';
import { SnackbarService } from '@shared/services/snackbar/snackbar.service';
import { SupplierFormModalComponent } from './components/supplier-form-modal/supplier-form-modal.component';
import { supplierSearchConfig, supplierTableActions, supplierTableColumns } from './constants/supplier';
import { AddSupplierInterface, Supplier } from './models/interface';
import { SupplierManagementService } from './services/supplier-management.service';

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

@Component({
  selector: 'app-supplier-management',
  imports: [
    TableComponent,
    FormsModule,
    ButtonComponent,
    MatIconModule,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    SearchComponent
  ],
  templateUrl: './supplier-management.component.html',
  styleUrl: './supplier-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplierManagementComponent implements OnInit {
  public isLoading = false;
  public pageSize = 10;
  private cdr = inject(ChangeDetectorRef);
  private supplierManagementService = inject(SupplierManagementService);
  private destroyRef = inject(DestroyRef);
  private readonly snackbarService = inject(SnackbarService);

  public readonly tableColumns: TableColumn[] = supplierTableColumns;
  public readonly tableActions: TableAction[] = supplierTableActions;
  public readonly supplierSearchConfig: SearchConfig = supplierSearchConfig;
  public tableData: Supplier[] = [];
  public filteredSuppliers: Supplier[] = [];
  public isLoadingSuppliers = false;

  constructor(private readonly modalService: ModalService) { }

  ngOnInit() {
    this.loadSuppliers();
  }

  public openAddSupplierModal(): void {
    const modalRef = this.modalService.openCustomModal(SupplierFormModalComponent, {
      width: '50%',
      maxWidth: '90vw',
      panelClass: 'custom-dialog-container',
      disableClose: false,
      data: { isEdit: false }
    });

    modalRef.afterClosed().subscribe(result => {
      if (result?.action === 'confirm') {
        this.handleAddSupplier(result.data);
      }
    });
  }

  private handleAddSupplier(supplierData: AddSupplierInterface): void {
    this.supplierManagementService.addSupplier(supplierData).subscribe({
      next: (response) => {
        this.snackbarService.showSuccess(response.message || 'Supplier added successfully');
        this.loadSuppliers();
      },
      error: (err) => {
        this.snackbarService.showError(err.error?.message || 'Failed to add supplier');
      }
    });
  }

  loadSuppliers(page: number = 0, limit: number = 10) {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.supplierManagementService.getAllSuppliers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.tableData = SupplierTableDataAdapter.adaptForTable(response.data.data);
          this.filteredSuppliers = [...this.tableData];
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.isLoading = false;
          this.tableData = [];
          this.filteredSuppliers = [];
          this.cdr.markForCheck();
        }
      });
  }

  onSupplierSearch(results: Supplier[]) {
    this.filteredSuppliers = results;
    this.cdr.markForCheck();
  }

  onSupplierSearchTermChange(term: string) {
    this.isLoadingSuppliers = term.length > 0;
    this.isLoadingSuppliers = false;
    this.cdr.markForCheck();
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected items:', selectedItems);
  }

  onActionClick(event: { action: string, item: Supplier }) {
    switch (event.action) {
      case 'edit':
        this.openEditSupplierModal(event.item);
        break;
      case 'delete':
        this.openDeleteConfirmation(event.item);
        break;
    }
  }

  private openEditSupplierModal(supplier: Supplier): void {
    const modalRef = this.modalService.openCustomModal(SupplierFormModalComponent, {
      width: '50%',
      maxWidth: '90vw',
      panelClass: 'custom-dialog-container',
      disableClose: false,
      data: { isEdit: true, supplier }
    });

    modalRef.afterClosed().subscribe(result => {
      if (result?.action === 'confirm') {
        this.handleEditSupplier(supplier.id, result.data);
      }
    });
  }

  private handleEditSupplier(supplierId: number, supplierData: any): void {
    this.supplierManagementService.updateSupplier(supplierId, supplierData).subscribe({
      next: (response) => {
        this.snackbarService.showSuccess('Supplier updated successfully');
        this.loadSuppliers();
      },
      error: (err) => {
        this.snackbarService.showError(err.error?.message || 'Failed to update supplier');
      }
    });
  }

  private openDeleteConfirmation(supplier: Supplier): void {
    const confirmed = confirm(`Are you sure you want to delete supplier "${supplier.name}"?`);
    if (confirmed) {
      this.handleDeleteSupplier(supplier.id);
    }
  }

  private handleDeleteSupplier(supplierId: number): void {
    this.supplierManagementService.deleteSupplier(supplierId).subscribe({
      next: (response) => {
        this.snackbarService.showSuccess('Supplier deleted successfully');
        this.loadSuppliers();
      },
      error: (err) => {
        this.snackbarService.showError(err.error?.message || 'Failed to delete supplier');
      }
    });
  }

  onPageChange(event: any) {
    console.log('Page changed:', event);
  }
}

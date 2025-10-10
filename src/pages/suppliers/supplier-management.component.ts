import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ModalService } from '@shared/components/modal/service/modal.service';
import { SearchConfig } from '@shared/components/search/interface';
import { SearchComponent } from '@shared/components/search/search.component';
import { StatusConfig, TableAction, TableColumn } from '@shared/components/user-management/table/interface/interface';
import { TableComponent } from '@shared/components/user-management/table/table.component';
import { STATUS_COLORS } from '@shared/constants/colors.constant';
import { SupplierFormModalComponent } from './components/supplier-form-modal/supplier-form-modal.component';
import { supplierSearchConfig, supplierTableActions, supplierTableColumns } from './constants/supplier.constant';
import { Supplier } from './models/interface';
import { SupplierManagementService } from './services/supplier-management.service';

@Component({
  selector: 'app-supplier-management',
  imports: [
    TableComponent,
    FormsModule,
    ButtonComponent,
    MatIconModule,
    SearchComponent,
    MatProgressSpinner
  ],
  templateUrl: './supplier-management.component.html',
  styleUrl: './supplier-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplierManagementComponent implements OnInit {
  protected readonly supplierManagementService = inject(SupplierManagementService);
  private readonly modalService = inject(ModalService);

  protected readonly tableColumns: TableColumn[] = supplierTableColumns;
  protected readonly tableActions: TableAction[] = supplierTableActions;
  protected readonly supplierSearchConfig: SearchConfig = supplierSearchConfig;

  protected readonly statusConfig: StatusConfig = {
    Active: STATUS_COLORS.ACTIVE,
    Inactive: STATUS_COLORS.INACTIVE
  };

  ngOnInit() {
    this.supplierManagementService.getSuppliers({ useCache: true });
  }

  public openAddSupplierModal(): void {
    const modalRef =
      this.modalService.openCustomModal(SupplierFormModalComponent, {
        width: '50%',
        maxWidth: '90vw',
        panelClass: 'custom-dialog-container',
        disableClose: false,
        data: { isEdit: false }
      });

    modalRef.afterClosed().subscribe(result => {
      if (result?.action === 'confirm') {
        this.supplierManagementService.addSupplier(result.data);
      }
    });
  }

  protected onSupplierSearchTermChange(term: string) {
    this.supplierManagementService.searchQuery = term;
    this.supplierManagementService.getSuppliers({
      useCache: false,
      showLoader: true
    });
  }

  protected onSelectionChange(selectedItems: any[]) {
    console.log('Selected items:', selectedItems);
  }

  protected onActionClick(event: { action: string, item: Supplier }) {
    if (event.action == 'edit') {
      this.openEditSupplierModal(event.item);
    }
  }

  private openEditSupplierModal(supplier: Supplier): void {
    const modalRef =
      this.modalService.openCustomModal(SupplierFormModalComponent, {
        width: '50%',
        maxWidth: '90vw',
        panelClass: 'custom-dialog-container',
        disableClose: false,
        data: { isEdit: true, supplier }
      });

    modalRef.afterClosed().subscribe(result => {
      if (result?.action === 'confirm') {
        this.supplierManagementService.updateSupplier(supplier.id, result.data);
      }
    });
  }

  protected onPageChange(event: any) {
    console.log('Page changed:', event);
  }
}

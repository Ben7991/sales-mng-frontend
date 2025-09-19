import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ModalService } from '@shared/components/modal/service/modal.service';
import { SearchConfig } from '@shared/components/search/interface';
import { SearchComponent } from '@shared/components/search/search.component';
import { TableAction, TableColumn } from '@shared/components/user-management/table/interface/interface';
import { TableComponent } from '@shared/components/user-management/table/table.component';
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
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly supplierManagementService = inject(SupplierManagementService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly modalService = inject(ModalService);

  public readonly tableColumns: TableColumn[] = supplierTableColumns;
  public readonly tableActions: TableAction[] = supplierTableActions;
  public readonly supplierSearchConfig: SearchConfig = supplierSearchConfig;
  public tableData: Supplier[] = [];

  ngOnInit() {
    this.supplierManagementService.getASuppliers();
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

  onSupplierSearch(results: Supplier[]) {
    // this.filteredSuppliers = results;
    this.cdr.markForCheck();
  }

  onSupplierSearchTermChange(term: string) {
    // this.isLoadingSuppliers = term.length > 0;
    // this.isLoadingSuppliers = false;
    this.cdr.markForCheck();
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected items:', selectedItems);
  }

  onActionClick(event: { action: string, item: Supplier }) {
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

  onPageChange(event: any) {
    console.log('Page changed:', event);
  }
}

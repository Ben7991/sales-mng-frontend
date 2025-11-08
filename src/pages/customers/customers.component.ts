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
import { TableAction, TableColumn } from '@shared/components/user-management/table/interface/interface';
import { TableComponent } from '@shared/components/user-management/table/table.component';
import { CustomerFormModalComponent } from './components/customer-form-modal/customer-form-modal.component';
import { customerSearchConfig, customerTableActions, customerTableColumns } from './constants/customer.constant';
import { Customer } from './models/interface';
import { CustomerManagementService } from './services/customer-management.service';

@Component({
  selector: 'app-customers',
  imports: [
    TableComponent,
    FormsModule,
    ButtonComponent,
    MatIconModule,
    SearchComponent,
    MatProgressSpinner,
    TableComponent
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersComponent implements OnInit {
  protected readonly customerManagementService = inject(CustomerManagementService);
  private readonly modalService = inject(ModalService);

  protected readonly tableColumns: TableColumn[] = customerTableColumns;
  protected readonly tableActions: TableAction[] = customerTableActions;
  protected readonly customerSearchConfig: SearchConfig = customerSearchConfig;

  ngOnInit() {
    this.customerManagementService.getCustomers({ useCache: true });
  }

  public openAddCustomerModal(): void {
    const modalRef =
      this.modalService.openCustomModal(CustomerFormModalComponent, {
        width: '50%',
        maxWidth: '90vw',
        panelClass: 'custom-dialog-container',
        disableClose: false,
        data: { isEdit: false }
      });

    modalRef.afterClosed().subscribe(result => {
      if (result?.action === 'confirm') {
        this.customerManagementService.addCustomer(result.data);
      }
    });
  }

  protected onCustomerSearchTermChange(term: string) {
    this.customerManagementService.searchQuery = term;
    this.customerManagementService.getCustomers({
      useCache: false,
      showLoader: true
    });
  }

  protected onSelectionChange(selectedItems: any[]) {
    console.log('Selected items:', selectedItems);
  }

  protected onActionClick(event: { action: string, item: Customer }) {
    if (event.action == 'edit') {
      this.openEditCustomerModal(event.item);
    }
  }

  private openEditCustomerModal(customer: Customer): void {
    const modalRef =
      this.modalService.openCustomModal(CustomerFormModalComponent, {
        width: '50%',
        maxWidth: '90vw',
        panelClass: 'custom-dialog-container',
        disableClose: false,
        data: { isEdit: true, customer }
      });

    modalRef.afterClosed().subscribe(result => {
      if (result?.action === 'confirm') {
        this.customerManagementService.updateCustomer(customer.id, result.data);
      }
    });
  }

  protected onPageChange(event: any) {
    this.customerManagementService.currentPage = event.pageIndex;
    this.customerManagementService.currentPageSize = event.pageSize;
    this.customerManagementService.getCustomers({
      useCache: false,
      showLoader: true
    });
  }
}

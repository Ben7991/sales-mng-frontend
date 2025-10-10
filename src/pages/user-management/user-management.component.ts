import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit
} from '@angular/core';
import {TableComponent} from '@shared/components/user-management/table/table.component';
import {StatusConfig, TableAction, TableColumn} from '@shared/components/user-management/table/interface/interface';
import {FormsModule} from '@angular/forms';
import {ButtonComponent} from '@shared/components/button/button.component';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {SearchComponent} from '@shared/components/search/search.component';
import {SearchConfig} from '@shared/components/search/interface';
import {UserManagementService} from './service/user-management.service';
import {userSearchConfig, userTableActions, userTableColumns} from './constants/user-management.const';
import {ModalService} from '@shared/components/modal/service/modal.service';
import { UserFormModalComponent} from './components/user-form-modal/user-form-modal.component';
import {MatDivider} from '@angular/material/divider';
import {UserAccountStatus} from '@shared/models/types';
import {ChangeStatusModalComponent} from './components/change-status-modal/change-status-modal.component';
import {PageEvent} from '@angular/material/paginator';
import {STATUS_COLORS} from '@shared/constants/colors.constant';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-management',
  imports: [
    TableComponent,
    FormsModule,
    ButtonComponent,
    MatIconModule,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatDivider,
    MatProgressSpinner,
    SearchComponent
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserManagementComponent implements OnInit{
  protected readonly userManagementService = inject(UserManagementService);
  private readonly modalService = inject(ModalService);

  protected readonly tableColumns: TableColumn[] = userTableColumns;
  protected readonly tableActions: TableAction[] = userTableActions;
  protected readonly userSearchConfig: SearchConfig = userSearchConfig;

  protected readonly statusConfig: StatusConfig = {
    'ACTIVE': STATUS_COLORS.ACTIVE,
    'QUIT': STATUS_COLORS.QUIT,
    'FIRED': STATUS_COLORS.INACTIVE
  };

  ngOnInit() {
    this.userManagementService.getUsers({ useCache: true });
  }

  protected onUserSearchTermChange(term: string): void {
    this.userManagementService.searchQuery = term;
    this.userManagementService.currentPage = 0;
    this.userManagementService.getUsers({ useCache: false, showLoader: true });
  }

  protected onPageChange(event: PageEvent): void {
    this.userManagementService.currentPage = event.pageIndex;
    this.userManagementService.currentPageSize = event.pageSize;
    this.userManagementService.getUsers({ useCache: false, showLoader: true });
  }

  public openUserModal(user?: any): void {
    const isEdit = !!user;

    const modalRef = this.modalService.openCustomModal(UserFormModalComponent, {
      width: '50%',
      maxWidth: '90vw',
      disableClose: false,
      data: {
        isEdit,
        user: user ?? null
      }
    });

    modalRef.afterClosed().subscribe(result => {
      if (result?.action === 'confirm') {
        if (isEdit) {
          this.userManagementService.updateUserAndRefresh(user.id, result.data);
        } else {
          this.userManagementService.addUserAndRefresh(result.data);
        }
      }
    });
  }

  protected onSelectionChange(selectedItems: any[]): void {
    // selection change handler
  }

  public onActionClick(event: { action: string; item: any }): void {
    if (event.action === 'edit') {
      this.openUserModal(event.item);
    } else if (event.action === 'change status') {
      const modalRef = this.modalService.openCustomModal(ChangeStatusModalComponent, {
        width: '50%',
        maxWidth: '90vw',
        data: { currentStatus: event.item.status }
      });

      modalRef.afterClosed().subscribe((newStatus: UserAccountStatus) => {
        if (newStatus && newStatus !== event.item.status) {
          this.userManagementService.changeUserStatusAndRefresh(event.item.id, newStatus);
        }
      });
    }
  }

  public filterStatus(stats: string): void {
    this.userManagementService.searchQuery = stats;
    this.userManagementService.currentPage = 0;
    this.userManagementService.getUsers({ useCache: false, showLoader: true });
  }
}

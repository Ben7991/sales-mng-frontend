import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit, signal
} from '@angular/core';
import {TableComponent} from '@shared/components/user-management/table/table.component';
import {TableAction, TableColumn} from '@shared/components/user-management/table/interface/interface';
import {User} from '@shared/models/interface';
import {FormsModule} from '@angular/forms';
import {ButtonComponent} from '@shared/components/button/button.component';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {SearchComponent} from '@shared/components/search/search.component';
import {SearchConfig} from '@shared/components/search/interface';
import {UserManagementService} from './service/user-management.service';
import {userSearchConfig, userTableActions, userTableColumns} from './constants/user-management.const';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ModalService} from '@shared/components/modal/service/modal.service';
import { UserFormModalComponent} from './components/user-form-modal/user-form-modal.component';
import {addUserInterface} from './interface';
import {SnackbarService} from '@shared/services/snackbar/snackbar.service';
import {MatDivider} from '@angular/material/divider';
import {UserAccountStatus} from '@shared/models/types';
import {ChangeStatusModalComponent} from './components/change-status-modal/change-status-modal.component';
import {PageEvent} from '@angular/material/paginator';

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
    SearchComponent,
    MatDivider
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserManagementComponent implements OnInit{
  public isLoading = false;
  public pageSize = 10 ;
  public totalUsers: number | undefined  = 0;
  private cdr = inject(ChangeDetectorRef);
  private userManagementService = inject(UserManagementService);
  private destroyRef = inject(DestroyRef)
  private readonly snackbarService = inject(SnackbarService);
  public pageIndex = 0;
  public readonly tableColumns: TableColumn[] = userTableColumns
  public readonly tableActions: TableAction[] = userTableActions
  public readonly userSearchConfig: SearchConfig = userSearchConfig
  public tableData: User[] = [];
  public filteredUsers: User[] = [];
  public isLoadingUsers = false;

  ngOnInit() {
    this.loadUsers();
  }

  constructor(private readonly modalService: ModalService) {}
  public readonly lastResult = signal<any>(null);

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
          this.handleUpdateUser(user.id, result.data);
        } else {
          this.handleAddUser(result.data);
        }
      }
    });
  }

  private handleAddUser(userData: addUserInterface): void {
    this.userManagementService.addUser(userData).subscribe({
      next: (response) => {
        this.snackbarService.showSuccess(response.message)
        this.loadUsers(this.pageIndex, this.pageSize);
      },
      error: (err) => {
        this.snackbarService.showError(err.error.message)
      }
    })
  }

  private handleUpdateUser(userId: string, userdata: Partial<addUserInterface>): void {
    this.userManagementService.updateUserInfo(userId, userdata).subscribe({
      next: (response) => {
        this.snackbarService.showSuccess(response.message)
        this.loadUsers(this.pageIndex, this.pageSize);
      },
      error: (err) => {
        this.snackbarService.showError(err.error.message)
      }
    })
  }



  public  loadUsers(page: number = 0, limit: number = 10) {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.userManagementService.getAllUsers({ page, perPage: limit })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.tableData = response.data.users;
          this.filteredUsers = [...this.tableData];
          this.totalUsers = response.data.count;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.tableData = [];
          this.filteredUsers = [];
          this.totalUsers = 0;
          this.cdr.markForCheck();
        }
      });
  }


  onUserSearch(results: User[]) {
    this.filteredUsers = results;
    this.cdr.markForCheck();
  }

  onUserSearchTermChange(term: string) {
    this.isLoadingUsers = term.length > 0;
      this.isLoadingUsers = false;
      this.cdr.markForCheck();
  }


  onSelectionChange(selectedItems: any[]) {
  }

  public onActionClick(event: { action: string; item: any }) {
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
          this.userManagementService.changeUserStatus(event.item.id, newStatus).subscribe({
            next: (response) => {
              this.snackbarService.showSuccess(response.message)
              event.item.status = newStatus;
              this.loadUsers(this.pageIndex, this.pageSize);
            },
            error: (err) => {
              this.snackbarService.showError(err.error.message)
            },
          });
        }
      });
    }
  }


 public onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
   this.pageIndex = event.pageIndex;

   this.loadUsers(this.pageIndex, this.pageSize);
  }

 public filterStatus(stats: string) {
    this.isLoading = true
    this.userManagementService.getAllUsers({q:stats}).subscribe({
      next: (response) => {
        this.filteredUsers = response.data.users;
        this.isLoading = false
      },
      error: (err) => {
        this.snackbarService.showError(err.error.message)
        this.isLoading = false
      }
    })

  }
}

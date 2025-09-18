import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {
  UserFormModalComponent
} from '../../../../pages/user-management/components/user-form-modal/user-form-modal.component';
import {ModalConfig} from '@shared/components/modal/interface/interface';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private readonly dialog: MatDialog) {}

  public openModal<T = any>(
    config: ModalConfig & { data?: T } = {}
  ): MatDialogRef<UserFormModalComponent> {
    const dialogConfig: MatDialogConfig = {
      width: config.width || '500px',
      maxWidth: config.maxWidth || '90vw',
      height: config.height,
      maxHeight: config.maxHeight || '90vh',
      disableClose: config.disableClose || false,
      data: {
        config,
        data: config.data
      },
      panelClass: 'custom-modal-panel'
    };

    return this.dialog.open(UserFormModalComponent, dialogConfig);
  }

  public openCustomModal<T, R = any>(
    component: Type<T>,
    config: MatDialogConfig<any> = {}
  ): MatDialogRef<T, R> {
    const dialogConfig: MatDialogConfig = {
      width: '500px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      ...config
    };
    return this.dialog.open(component, dialogConfig);
  }

  public closeAll(): void {
    this.dialog.closeAll();
  }
}

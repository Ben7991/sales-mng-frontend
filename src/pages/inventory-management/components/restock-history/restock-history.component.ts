import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SearchComponent } from '@shared/components/search/search.component';
import { TableComponent } from '@shared/components/user-management/table/table.component';

import { PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import {HistoryServiceService} from './service/history-service.service';
import {
  inventoryHistorySearchConfig,
  stockHistoryTableActions,
  stockHistoryTableColumns
} from './constant/history.const';
import {StatusConfig} from '@shared/components/user-management/table/interface/interface';
import {inventorySearchConfig} from '../inventory/constant/inventory.const';
import {SearchConfig} from '@shared/components/search/interface';
import {STATUS_COLORS} from '@shared/constants/colors.constant';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {RestockDetailComponent} from './components/restock-detail/restock-detail.component';
import {ModalService} from '@shared/components/modal/service/modal.service';
import {MatDivider} from '@angular/material/divider';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {SupplierManagementService} from '../../../suppliers/services/supplier-management.service';
import {Supplier} from '../../../suppliers/models/interface';

@Component({
  selector: 'app-restock-history',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    SearchComponent,
    TableComponent,
    MatProgressSpinner,
    MatDivider,
    MatIconModule,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    TableComponent,
  ],
  templateUrl: './restock-history.component.html',
  styleUrl: './restock-history.component.scss'
})
export class RestockHistoryComponent implements OnInit {
  protected readonly historyService = inject(HistoryServiceService);
  protected readonly supplierManagementService = inject(SupplierManagementService);
  protected readonly stockHistoryTableColumns = stockHistoryTableColumns;
  protected readonly stockHistoryTableActions = stockHistoryTableActions;
  public readonly inventoryHistorySearchConfig: SearchConfig = inventoryHistorySearchConfig;
  public readonly suppliers = this.supplierManagementService.suppliers;
  public readonly isLoadingSuppliers = this.supplierManagementService.isLoadingSuppiers;
  private modalService = inject(ModalService)
  public readonly currentPage = signal(0);
  public readonly currentPerPage = signal(10);
  public activeSupplierId = signal<number | null>(null);
  public readonly historyData$ = this.historyService.stockHistory$;
  public readonly isLoading$ = this.historyService.isLoadingHistory;

  ngOnInit(): void {
    this.fetchHistoryData();
    this.supplierManagementService.getSuppliers();
  }

  protected fetchHistoryData(): void {
    this.historyService.getAllStockHistory({
      page: this.currentPage(),
      perPage: this.currentPerPage(),
      q: this.historyService.searchQuery
    });
  }

  onUserSearchTermChange(query: string) {
    this.historyService.searchQuery = query;
    this.currentPage.set(0);
    this.fetchHistoryData();
  }

  onPageChange(event: PageEvent) {
    this.currentPerPage.set(event.pageSize);
    this.currentPage.set(event.pageIndex);
    this.fetchHistoryData();
  }

  protected readonly inventoryHistoryStatusConfig: StatusConfig = {
    'IN_USE': STATUS_COLORS.GREEN,
    'QUIT': STATUS_COLORS.ORANGE,
    'FIRED': STATUS_COLORS.RED
  };

  openDetailModal(item: any) {
    this.modalService.openCustomModal(RestockDetailComponent, {
      width: '650px',
      maxWidth: '90vw',
      disableClose: false,
      data: {
        item: item
      }
    });
  }
  onActionClick(event: { action: any; item: any; }): void {
    if (event.action === 'ViewDetail') {
      const rawItem = event.item;
      this.openDetailModal(rawItem);
    }
  }
  protected readonly inventorySearchConfig = inventorySearchConfig;

  filterBySupplier(supplier: Supplier | null): void {
    this.activeSupplierId.set(supplier!.id);
    this.currentPage.set(0);
    this.historyService.getAllStockHistory({
      page: this.currentPage(),
      perPage: this.currentPerPage(),
      q: supplier?.name
    });
  }
}

import {Component, inject, OnInit} from '@angular/core';
import {SearchConfig} from '@shared/components/search/interface';
import {inventorySearchConfig, inventoryTableActions, inventoryTableColumns} from './constant/inventory.const';
import {SearchComponent} from '@shared/components/search/search.component';
import {ButtonComponent} from '@shared/components/button/button.component';
import {TableComponent} from '@shared/components/user-management/table/table.component';
import {PageEvent} from '@angular/material/paginator';
import {InventoryService} from './service/inventory.service';
import {ModalService} from '@shared/components/modal/service/modal.service';
import {Inventory} from '../model/interface';
import {InventoryFormComponent} from './component/inventory-form/inventory-form.component';
import {StatusConfig} from '@shared/components/user-management/table/interface/interface';
import {STATUS_COLORS} from '@shared/constants/colors.constant';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-inventory',
  imports: [
    SearchComponent,
    ButtonComponent,
    TableComponent,
    MatProgressSpinner
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit{
  public readonly inventorySearchConfig: SearchConfig = inventorySearchConfig;
  protected readonly tableColumns = inventoryTableColumns;
  protected readonly tableActions = inventoryTableActions;
  protected inventoryService = inject(InventoryService)
  private modalService = inject(ModalService)

  ngOnInit() {
    this.onload(this.inventoryService.currentInventoryPage ,this.inventoryService.currentInventoryPerPage  )
  }
  protected readonly inventoryStatusConfig: StatusConfig = {
    'IN_STOCK': STATUS_COLORS.ACTIVE,
    'LOW_STOCK': STATUS_COLORS.QUIT,
    'OUT_OF_STOCK': STATUS_COLORS.INACTIVE
  };

  public get tableData(): Inventory[] {
    return this.inventoryService.Inventories$();
  }

  onload(page:number , limit:number){
    this.inventoryService.getAllInventory(
      {
        page: page,
        perPage: limit,
        q: this.inventoryService.searchQuery
      },
      { useCache: false, showLoader: true }
    );
  }

  onUserSearchTermChange(term: string) {
    this.inventoryService.searchQuery = term;
    this.inventoryService.currentInventoryPage = 0;
    this.inventoryService.getAllInventory(
      {
        page: this.inventoryService.currentInventoryPage,
        perPage: this.inventoryService.currentInventoryPerPage ,
        q: term
      },
      { useCache: false, showLoader: true }
    );
  }

  public openModal(inventory?: any): void {
    const isEdit = !!inventory;
    const modalRef = this.modalService.openCustomModal(InventoryFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: false,
      data: {
        isEdit,
        inventory: inventory ?? null
      }
    });

    modalRef.afterClosed().subscribe(result => {
      if (result?.action === 'confirm') {
        if (isEdit && inventory?.id) {
          this.handleUpdateInventory(inventory.id, result.data);
        } else {
          this.handleAddInventory(result.data);
        }
      }
    });
  }

  private handleAddInventory(formData: any): void {
    const inventoryData = {
      productId: formData.productId || 0,
      description: formData.description,
      retailUnitPrice: formData.unitPriceRetail || 0,
      wholesaleUnitPrice: formData.unitPriceWholesale || 0,
      wholesalePrice: formData.wholesalePriceBox || 0,
      specialPrice: formData.specialPriceBox || 0,
      totalPieces: formData.totalPieces || 0,
      numberOfBoxes: formData.numberOfBoxes || 0,
      minimumThreshold: formData.minThreshold || 0,
      supplierId: formData.supplier ? parseInt(formData.supplier) : 0
    };

    this.inventoryService.addInventory(inventoryData);
  }


  private handleUpdateInventory(inventoryId: number, formData: any): void {
    const inventoryData = {
      productId: formData.productId || 0,
      description: formData.description,
      retailUnitPrice: parseFloat(formData.unitPriceRetail) || 0,
      wholesaleUnitPrice: parseFloat(formData.unitPriceWholesale) || 0,
      wholesalePrice: parseFloat(formData.wholesalePriceBox) || 0,
      specialPrice: parseFloat(formData.specialPriceBox) || 0,
      totalPieces: formData.totalPieces || 0,
      numberOfBoxes: formData.numberOfBoxes || 0,
      minimumThreshold: formData.minThreshold || 0,
      supplierId: formData.supplier ? parseInt(formData.supplier) : 0
    };

    this.inventoryService.updateInventory(inventoryId, inventoryData);
  }

  onPageChange($event: PageEvent) {
    const pageIndex = this.inventoryService.currentInventoryPage = $event.pageIndex;
    const pageSize = this.inventoryService.currentInventoryPerPage = $event.pageSize;
    this.onload(pageIndex, pageSize);
  }

  onActionClick($event: { action: string; item: any }) {
    if ($event.action === 'edit') {
      this.openModal($event.item);
    }
  }
}

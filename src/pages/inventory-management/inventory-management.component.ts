import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ProductsComponent } from './components/products/products.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { RestockHistoryComponent } from './components/restock-history/restock-history.component';
import { AuthorizationService } from '@shared/services/auth/authorization.service';
import { Page } from '@shared/models/enums';
import { INVENTORY_FEATURES } from '@shared/constants/rbac.constants';

@Component({
  selector: 'app-inventory-management',
  imports: [MatTabGroup, MatTab, ProductsComponent, InventoryComponent, RestockHistoryComponent],
  templateUrl: './inventory-management.component.html',
  styleUrl: './inventory-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryManagementComponent {
  private authorizationService = inject(AuthorizationService);

  // Permission checks
  protected canViewProducts = this.authorizationService.hasFeatureAccess(Page.INVENTORY, INVENTORY_FEATURES.VIEW_PRODUCTS);
  protected canViewInventory = this.authorizationService.hasFeatureAccess(Page.INVENTORY, INVENTORY_FEATURES.VIEW_INVENTORY);
  protected canViewRestockHistory = this.authorizationService.hasFeatureAccess(Page.INVENTORY, INVENTORY_FEATURES.VIEW_RESTOCK_HISTORY);
}

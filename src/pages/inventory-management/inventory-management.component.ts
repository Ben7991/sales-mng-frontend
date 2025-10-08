import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ProductsComponent } from './components/products/products.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { RestockHistoryComponent } from './components/restock-history/restock-history.component';

@Component({
  selector: 'app-inventory-management',
  imports: [MatTabGroup, MatTab, ProductsComponent, InventoryComponent, RestockHistoryComponent],
  templateUrl: './inventory-management.component.html',
  styleUrl: './inventory-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryManagementComponent {

}

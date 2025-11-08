import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ModalService } from '@shared/components/modal/service/modal.service';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';
import { SearchConfig } from '@shared/components/search/interface';
import { SearchComponent } from '@shared/components/search/search.component';
import { StatusConfig, TableAction, TableColumn } from '@shared/components/user-management/table/interface/interface';
import { TableComponent } from '@shared/components/user-management/table/table.component';
import { STATUS_COLORS } from '@shared/constants/colors.constant';
import { toTitleCase } from '@shared/utils/string.util';
import { CategoryFormModalComponent } from './components/category-form-modal/category-form-modal.component';
import { ProductFormModalComponent } from './components/product-form-modal/product-form-modal.component';
import {
  CATEGORIES_PAGE_SIZE,
  categorySearchConfig,
  categoryTableActions,
  categoryTableColumns,
  PRODUCTS_PAGE_SIZE,
  productSearchConfig,
  productTableActions,
  productTableColumns
} from './constants/products.constant';
import { Category, Product } from './models/interface';
import { ProductsManagementService } from './services/products-management.service';

@Component({
  selector: 'app-products',
  imports: [
    TableComponent,
    ButtonComponent,
    MatIconModule,
    SearchComponent,
    MatProgressSpinner,
    PaginatorComponent,
    TableComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {
  protected readonly productsService = inject(ProductsManagementService);
  private readonly modalService = inject(ModalService);

  // Category configuration
  protected readonly categoryTableColumns: TableColumn[] = categoryTableColumns;
  protected readonly categoryTableActions: TableAction[] = categoryTableActions;
  protected readonly categorySearchConfig: SearchConfig = categorySearchConfig;
  protected readonly categoriesPageSize = CATEGORIES_PAGE_SIZE;

  // Product configuration
  protected readonly productTableColumns: TableColumn[] = productTableColumns;
  protected readonly productTableActions: TableAction[] = productTableActions;
  protected readonly productSearchConfig: SearchConfig = productSearchConfig;
  protected readonly productsPageSize = PRODUCTS_PAGE_SIZE;

  protected readonly productStatusConfig: StatusConfig = {
    'In Use': STATUS_COLORS.ACTIVE,
    'Discontinued': STATUS_COLORS.INACTIVE,
  };

  ngOnInit(): void {
    this.productsService.getCategories({ useCache: true });
    this.productsService.getProducts({ useCache: true });
  }

  /* =============== CATEGORY HANDLERS =============== */

  protected onCategorySearchTermChange(term: string): void {
    this.productsService.categorySearchQuery = term;
    this.productsService.currentCategoryPage = 0;
    this.productsService.getCategories({ useCache: false, showLoader: true });
  }

  protected onCategoryPageChange(event: PageEvent): void {
    this.productsService.currentCategoryPage = event.pageIndex;
    this.productsService.currentCategoryPageSize = event.pageSize;
    this.productsService.getCategories({ useCache: false, showLoader: true });
  }

  protected onCategoryActionClick(event: { action: string; item: Category }): void {
    if (event.action === 'edit') {
      this.openEditCategoryModal(event.item);
    }
  }

  protected openAddCategoryModal(): void {
    const modalRef = this.modalService.openCustomModal(CategoryFormModalComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'custom-dialog-container',
      disableClose: false,
      data: { isEdit: false }
    });

    modalRef.afterClosed().subscribe(result => {
      if (result?.action === 'confirm') {
        this.productsService.addCategory(result.data);
      }
    });
  }

  private openEditCategoryModal(category: Category): void {
    const modalRef = this.modalService.openCustomModal(CategoryFormModalComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'custom-dialog-container',
      disableClose: false,
      data: { isEdit: true, category }
    });

    modalRef.afterClosed().subscribe(result => {
      if (result?.action === 'confirm') {
        this.productsService.updateCategory(category.id, result.data);
      }
    });
  }

  /* =============== PRODUCT HANDLERS =============== */

  protected onProductSearchTermChange(term: string): void {
    this.productsService.productSearchQuery = term;
    this.productsService.currentProductPage = 0;
    this.productsService.getProducts({ useCache: false, showLoader: true });
  }

  protected onProductPageChange(event: PageEvent): void {
    this.productsService.currentProductPage = event.pageIndex;
    this.productsService.currentProductPageSize = event.pageSize;
    this.productsService.getProducts({ useCache: false, showLoader: true });
  }

  protected onProductActionClick(event: { action: string; item: Product }): void {
    if (event.action === 'edit') {
      this.openEditProductModal(event.item);
    }
  }

  protected openAddProductModal(): void {
    const modalRef = this.modalService.openCustomModal(ProductFormModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      panelClass: 'custom-dialog-container',
      disableClose: false,
      data: {
        isEdit: false,
        categories: this.productsService.categories() || []
      }
    });

    modalRef.afterClosed().subscribe(result => {
      if (result?.action === 'confirm') {
        const { file, ...productData } = result.data;
        this.productsService.addProduct({
          ...productData,
          file
        });
      }
    });
  }

  private openEditProductModal(product: Product): void {
    const modalRef = this.modalService.openCustomModal(ProductFormModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      panelClass: 'custom-dialog-container',
      disableClose: false,
      data: {
        isEdit: true,
        product,
        categories: this.productsService.categories() || []
      }
    });

    modalRef.afterClosed().subscribe(result => {
      if (result?.action === 'confirm') {
        const { file, ...productData } = result.data;

        // Product basic info update (name, category, status)
        this.productsService.updateProduct(product.id, productData);

        // If a new image was selected, update it separately
        if (file) {
          this.productsService.updateProductImage(product.id, { file });
        }
      }
    });
  }

  protected toTitleCase(str: string): string {
    return toTitleCase(str);
  }
}


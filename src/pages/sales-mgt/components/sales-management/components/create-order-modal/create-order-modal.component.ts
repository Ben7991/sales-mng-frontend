import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {MatStep, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {
  MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {ProductI, CreateOrderRequest, OrderSale} from '../../models/interface';
import {ButtonComponent} from '@shared/components/button/button.component';
import {LiveSearchDropdownComponent} from '@shared/components/live-search-dropdown/live-search-dropdown.component';
import {LiveSearchItem} from '@shared/models/interface';
import {SnackbarService} from '@shared/services/snackbar/snackbar.service';
import {catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap, tap} from 'rxjs';
import {SalesService} from '../../service/sales.service';
import {
  ProductsManagementService
} from '../../../../../inventory-management/components/products/services/products-management.service';
import {CustomerManagementService} from '../../../../../customers/services/customer-management.service';

const LIVE_SEARCH_DEBOUNCE_TIME = 300;

interface AddedProductWithStock extends ProductI {
  stockId: number;
}

@Component({
  selector: 'app-create-order-modal',
  imports: [
    MatStepper,
    MatStep,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatIconModule,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatHeaderCellDef,
    MatCellDef,
    MatColumnDef,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatStepperNext,
    MatStepperPrevious,
    MatSelectModule,
    ButtonComponent,
    LiveSearchDropdownComponent
  ],
  templateUrl: './create-order-modal.component.html',
  styleUrl: './create-order-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOrderModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateOrderModalComponent>);
  public data = inject(MAT_DIALOG_DATA, { optional: true });
  private readonly productsService = inject(ProductsManagementService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly customerService = inject(CustomerManagementService);
  private readonly salesService = inject(SalesService);

  protected isEditMode = false;
  protected editOrderId: number | null = null;


  protected productsForm!: FormGroup;
  protected customerForm!: FormGroup;
  protected commentForm!: FormGroup;

  addedProducts: AddedProductWithStock[] = [];
  displayedColumns = ['product', 'qty', 'actions'];
  orderTypes: { value: OrderSale; label: string }[] = [
    { value: 'RETAIL', label: 'Retail' },
    { value: 'WHOLESALE', label: 'Wholesale' },
    {value: 'SPECIAL_PURCHASE', label:'Special Order' }
  ];
  selectedOrderType: OrderSale | '' = '';

  protected readonly searchResults = signal<LiveSearchItem[]>([]);
  protected readonly isSearching = signal(false);
  protected readonly showSearchDropdown = signal(false);
  protected readonly productNotFound = signal(false);
  private readonly searchSubject = new Subject<string>();
  private selectedProduct: any = null;
  private isSelectingProduct = false;

  protected readonly customerSearchResults = signal<LiveSearchItem[]>([]);
  protected readonly isCustomerSearching = signal(false);
  protected readonly showCustomerSearchDropdown = signal(false);
  private readonly customerSearchSubject = new Subject<string>();
  private isSelectingCustomer = false;


  ngOnInit() {
    this.initForms();
    this.setupProductSearch();
    this.setupProductNameListener();
    this.setupCustomerSearch();
    this.setupCustomerNameListener();

    // Check if edit mode
    if (this.data?.order) {
      this.isEditMode = true;
      this.editOrderId = this.data.order.id;
      this.prepopulateForm(this.data.order);
    }
  }

  private prepopulateForm(order: any) {
    console.log('Prepopulating with order:', order);
    console.log('Comment value:', order.comment);

    // Set customer
    let customerName = '';
    if (order.customer) {
      customerName = typeof order.customer === 'object' ? (order.customer.name || '') : order.customer;
    } else if (order.customerName) {
      customerName = order.customerName;
    }

    if (customerName) {
      this.customerForm.patchValue({
        customerName: customerName
      }, { emitEvent: false });
    }

    // Set comment
    if (order.comment) {
      console.log('Setting comment to:', order.comment);
      this.commentForm.patchValue({
        comment: order.comment
      });
      console.log('Comment form value after patch:', this.commentForm.get('comment')?.value);
    } else {
      console.log('No comment found in order object');
    }

    // Set order type
    const orderType = order.orderSale || order.orderType;
    if (orderType) {
      const upperType = String(orderType).toUpperCase();
      const matchedType = this.orderTypes.find(t => t.value === upperType)?.value;
      if (matchedType) {
        this.selectedOrderType = matchedType;
      }
    }

    // Set products - need to fetch full product details
    const items = order.orderItems || order.items || [];
    if (items.length > 0) {
      this.addedProducts = items.map((item: any) => {
        const stock = item.stock || {};
        const product = stock.product || item.product || {};

        // Try to find stockId from various possible locations
        const stockId = stock.id || item.stockId || (item.stock && item.stock.id) || item.id;

        return {
          stockId: stockId,
          name: product.name || item.productName || item.name || 'Product',
          quantity: item.quantity,
          price: item.unitPrice || item.price || 0,
          imagePath: product.imagePath || item.imagePath,
          status: product.status || item.status,
          category: product.category || item.category
        };
      });
    }
  }


  private setupProductSearch() {
    this.searchSubject.pipe(
      debounceTime(LIVE_SEARCH_DEBOUNCE_TIME),
      distinctUntilChanged(),
      tap(() => {
        this.searchResults.set([]);
        this.showSearchDropdown.set(false);
        this.productNotFound.set(false);
      }),
      switchMap((query) => {
        if (!query || query.trim().length < 2) {
          this.isSearching.set(false);
          return of({data: []});
        }

        this.isSearching.set(true);
        return this.productsService.searchStockProducts(query.trim()).pipe(
          catchError(() => {
            this.isSearching.set(false);
            return of({data: []});
          })
        );
      })
    ).subscribe((response) => {
      this.isSearching.set(false);
      const currentQuery = this.productsForm.get('productName')?.value?.trim();

      if (currentQuery && currentQuery.length >= 2) {
        if (response.data.length === 0) {
          this.productNotFound.set(true);
        } else {
          this.searchResults.set(response.data);
          this.showSearchDropdown.set(true);
        }
      }
    });
  }

  setupProductNameListener() {
    this.productsForm.get('productName')?.valueChanges.subscribe(value => {
      if (this.isSelectingProduct) {
        return;
      }

      if (this.selectedProduct && value !== this.selectedProduct.name) {
        this.selectedProduct = null;
      }

      if (value && value.length >= 2) {
        this.searchSubject.next(value);
      } else {
        this.searchResults.set([]);
        this.showSearchDropdown.set(false);
        this.productNotFound.set(false);
      }
    });
  }

  protected onProductNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  protected onProductNameKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.selectedProduct) {
        const quantityInput = document.querySelector('input[formControlName="quantity"]') as HTMLInputElement;
        if (quantityInput) {
          quantityInput.focus();
        }
      }
    }
  }

  protected onQuantityKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const productName = this.productsForm.get('productName')?.value;
      const quantity = this.productsForm.get('quantity')?.value;

      if (productName && quantity && quantity > 0 && this.selectedProduct) {
        this.addProduct();
      }
    }
  }

  protected onSelectSearchResult(item: LiveSearchItem): void {
    this.isSelectingProduct = true;
    this.selectedProduct = item;
    this.showSearchDropdown.set(false);
    this.productNotFound.set(false);
    this.productsForm.get('productName')?.setValue(item.name, { emitEvent: false });

    setTimeout(() => {
      const quantityInput = document.querySelector('input[formControlName="quantity"]') as HTMLInputElement;
      if (quantityInput) {
        quantityInput.focus();
      }
      this.isSelectingProduct = false;
    }, 100);
  }

  protected onInputFocus(): void {
    const currentValue = this.productsForm.get('productName')?.value || '';
    if (currentValue.trim().length >= 2) {
      if (this.searchResults().length > 0) {
        this.showSearchDropdown.set(true);
      } else if (this.productNotFound()) {
      }
    }
  }

  protected onInputBlur(): void {
    if (this.isSelectingProduct) {
      return;
    }
    setTimeout(() => {
      this.showSearchDropdown.set(false);
    }, 200);
  }

  private setupCustomerSearch() {
    this.customerSearchSubject.pipe(
      debounceTime(LIVE_SEARCH_DEBOUNCE_TIME),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.trim().length < 2) {
          this.showCustomerSearchDropdown.set(false);
          return of({data: []});
        }

        this.isCustomerSearching.set(true);
        this.showCustomerSearchDropdown.set(true);

        return this.customerService.searchCustomers(query.trim()).pipe(
          catchError(() => {
            this.isCustomerSearching.set(false);
            this.showCustomerSearchDropdown.set(false);
            return of({data: []});
          })
        );
      })
    ).subscribe(response => {
      this.isCustomerSearching.set(false);
      const results: LiveSearchItem[] = response.data.map((customer: any) => ({
        id: customer.id.toString(),
        name: customer.name
      }));
      this.customerSearchResults.set(results);
      this.showCustomerSearchDropdown.set(results.length > 0);
    });
  }

  private setupCustomerNameListener() {
    this.customerForm.get('customerName')?.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(value => {
        if (this.isSelectingCustomer) {
          return;
        }

        if (value && value.trim().length >= 2) {
          this.customerSearchSubject.next(value);
        } else {
          this.customerSearchResults.set([]);
          this.showCustomerSearchDropdown.set(false);
        }
      });
  }


  initForms() {
    this.productsForm = this.fb.group({
      productName: [''],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });

    this.customerForm = this.fb.group({
      customerName: ['', Validators.required],
    });

    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });
  }

  protected onCustomerInputBlur() {
    if (this.isSelectingCustomer) {
      return;
    }
    setTimeout(() => {
      this.showCustomerSearchDropdown.set(false);
    }, 200);
  }

  protected onCustomerSelected(item: LiveSearchItem) {
    this.isSelectingCustomer = true;
    this.showCustomerSearchDropdown.set(false);
    this.customerForm.get('customerName')?.setValue(item.name, { emitEvent: false });
    setTimeout(() => {
      this.isSelectingCustomer = false;
    }, 300);
  }

  addProduct() {
    const productName = this.productsForm.get('productName')?.value;
    const quantity = this.productsForm.get('quantity')?.value;

    if (!productName || productName.trim().length === 0) {
      this.snackbarService.showError('Please enter a product name');
      return;
    }

    if (!quantity || quantity <= 0) {
      this.snackbarService.showError('Please enter a valid quantity');
      return;
    }

    if (!this.selectedProduct) {
      this.snackbarService.showError('Product does not exist. Please check if product name is correct');
      return;
    }

    if (!this.selectedProduct.id) {
      this.snackbarService.showError('Invalid product selected');
      return;
    }

    const existingProduct = this.addedProducts.find(p => p.stockId === this.selectedProduct.id);
    if (existingProduct) {
      this.snackbarService.showError('This product is already added to the order');
      return;
    }

    const product: AddedProductWithStock = {
      stockId: this.selectedProduct.id,
      name: this.selectedProduct.name,
      quantity: quantity,
      price: this.selectedProduct.price || 0,
      imagePath: this.selectedProduct.imagePath,
      status: this.selectedProduct.status,
      category: this.selectedProduct.category
    };

    this.addedProducts = [...this.addedProducts, product];

    this.productsForm.patchValue({
      productName: '',
      quantity: '',
    });
    this.selectedProduct = null;
    this.searchResults.set([]);
    this.productNotFound.set(false);
  }

  removeProduct(index: number) {
    this.addedProducts = this.addedProducts.filter((_, i) => i !== index);
  }

  selectOrderType(type: OrderSale) {
    this.selectedOrderType = type;
  }

  submitOrder() {
    if (this.addedProducts.length === 0) {
      this.snackbarService.showError('Please add at least one product to the order');
      return;
    }

    if (!this.selectedOrderType) {
      this.snackbarService.showError('Please select an order type');
      return;
    }

    if (!this.customerForm.valid) {
      this.snackbarService.showError('Please enter customer name');
      return;
    }

    if (!this.commentForm.valid) {
      this.snackbarService.showError('Please enter a comment');
      return;
    }

    const orderRequest: CreateOrderRequest = {
      orderItems: this.addedProducts.map(product => ({
        stockId: product.stockId,
        quantity: product.quantity!
      })),
      orderSale: this.selectedOrderType as OrderSale,
      customer: this.customerForm.get('customerName')?.value,
      comment: this.commentForm.get('comment')?.value || undefined
    };

    if (this.isEditMode && this.editOrderId) {
      this.salesService.updateOrder(this.editOrderId, orderRequest).subscribe({
        next: () => {
          this.dialogRef.close(true);
        }
      });
    } else {
      this.salesService.createOrder(orderRequest).subscribe({
        next: () => {
          this.dialogRef.close(true);
        }
      });
    }
  }

  protected goToCustomerStep(stepper: any) {
    if (this.addedProducts.length === 0) {
      this.snackbarService.showError('Please add at least one product to the order');
      return;
    }

    if (!this.selectedOrderType) {
      this.snackbarService.showError('Please select an order type before proceeding');
      return;
    }

    stepper.next();
  }


  closeDialog() {
    this.dialogRef.close();
  }
}

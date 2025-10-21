// create-order-modal.component.ts - UPDATED
import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatStep, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDialogRef} from '@angular/material/dialog';
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
import {ProductI} from '../../models/interface';
import {ButtonComponent} from '@shared/components/button/button.component';

@Component({
  selector: 'app-create-order-modal',
  imports: [
    MatStepper,
    MatStep,
    ReactiveFormsModule,
    MatFormField,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
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
    ButtonComponent
  ],
  templateUrl: './create-order-modal.component.html',
  styleUrl: './create-order-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOrderModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateOrderModalComponent>);

  productsForm!: FormGroup;
  customerForm!: FormGroup;
  paymentForm!: FormGroup;

  addedProducts: ProductI[] = [];
  displayedColumns = ['product', 'qty', 'price', 'actions'];
  orderTypes = ['retail', 'wholesale', 'online'];
  selectedOrderType = '';

  showExistingProducts = false;
  selectedExistingProduct: { id?: string; name: any; price?: number; } | null = null;

  existingProducts: ({ id: string; name: string; price: number })[] = [
    { id: '1', name: 'Paper cup small', price: 50 },
    { id: '2', name: 'Paper cup medium', price: 75 },
    { id: '3', name: 'Paper cup large', price: 100 },
    { id: '4', name: 'Paper roll', price: 125 }
  ];

  filteredProducts: any[] = [];

  ngOnInit() {
    this.initForms();
    this.filteredProducts = this.existingProducts;
    this.setupProductNameListener();
  }

  initForms() {
    // Make the products form optional since we're checking products array instead
    this.productsForm = this.fb.group({
      productName: [''],  // Removed required validator
      quantity: ['', Validators.min(1)],  // Removed required validator
    });

    this.customerForm = this.fb.group({
      customerName: ['', Validators.required],
    });

    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      amountPaid: ['', [Validators.required, Validators.min(0)]]
    });
  }

  setupProductNameListener() {
    this.productsForm.get('productName')?.valueChanges.subscribe(value => {
      if (value && value.length > 0) {
        this.showExistingProducts = true;
        this.filteredProducts = this.existingProducts.filter(p =>
          p.name.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        this.showExistingProducts = false;
        this.filteredProducts = this.existingProducts;
      }
    });
  }

  selectExistingProduct(product: { id?: string; name: any; price?: number; } | null) {
    this.selectedExistingProduct = product;
    this.productsForm.patchValue({
      productName: product!.name
    });
    this.showExistingProducts = false;
  }

  onProductSelect(productName: string) {
    const product = this.existingProducts.find(p => p.name === productName);
    if (product) {
      this.selectedExistingProduct = product;
    }
  }

  addProduct() {
    const productName = this.productsForm.get('productName')?.value;
    const quantity = this.productsForm.get('quantity')?.value;

    // Validate that both fields have values before adding
    if (productName && quantity && quantity > 0) {
      const product: ProductI = {
        name: productName,
        quantity: quantity,
        orderType: this.selectedOrderType,
        price: this.selectedExistingProduct?.price || 125
      };

      this.addedProducts = [...this.addedProducts, product];

      // Reset form
      this.productsForm.patchValue({
        productName: '',
        quantity: '',
      });
      this.selectedExistingProduct = null;
      this.showExistingProducts = false;
    }
  }

  removeProduct(index: number) {
    this.addedProducts = this.addedProducts.filter((_, i) => i !== index);
  }

  selectOrderType(type: string) {
    this.selectedOrderType = type;
  }

  // Getter to check if we can proceed to next step
  canProceedToCustomer(): boolean {
    return this.addedProducts.length > 0 && this.selectedOrderType !== '';
  }

  submitOrder() {
    if (this.addedProducts.length > 0 && this.customerForm.valid && this.paymentForm.valid) {
      const orderData = {
        products: this.addedProducts,
        customer: this.customerForm.value,
        payment: this.paymentForm.value,
        orderType: this.selectedOrderType
      };

      console.log(orderData);
      this.dialogRef.close(orderData);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

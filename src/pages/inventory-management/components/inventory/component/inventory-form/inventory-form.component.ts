import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {SupplierManagementService} from '../../../../../suppliers/services/supplier-management.service';
import {ProductsManagementService} from '../../../products/services/products-management.service';
import {Product} from '../../../products/models/interface';
import {AddInventoryInterface, Inventory} from '../../../model/interface';

interface InventoryModalData {
  isEdit: boolean;
  inventory: Inventory | null;
}

@Component({
  selector: 'app-inventory-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    ButtonComponent,
    MatIconButton,
  ],
  templateUrl: './inventory-form.component.html',
  styleUrl: './inventory-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<InventoryFormComponent>);
  private readonly supplierService = inject(SupplierManagementService);
  private readonly productService = inject(ProductsManagementService);
  private readonly modalData: InventoryModalData = inject(MAT_DIALOG_DATA);

  public readonly isSubmitting = signal<boolean>(false);

  public readonly isEditMode = signal<boolean>(false);

  public readonly availableProducts = computed(() => {
    const products = this.productService.products();
    if (!products) return [];
    return products.map((product: Product) => ({
      value: product.id,
      label: product.name,
    }));
  });

  public readonly isLoadingProducts = computed(() =>
    this.productService.isLoadingProducts()
  );

  public readonly availableSuppliers = computed(() => {
    const suppliers = this.supplierService.suppliers();
    if (!suppliers) return [];
    return suppliers
      .filter(supplier => supplier.status.toLowerCase() === 'active')
      .map(supplier => ({
        value: supplier.id.toString(),
        label: `${supplier.name} - ${supplier.companyName}`
      }));
  });

  public readonly isLoadingSuppliers = computed(() =>
    this.supplierService.isLoadingSuppiers()
  );

  public readonly inventoryForm: FormGroup = this.formBuilder.group({
    productId: [null, [Validators.required]],
    description: [''],
    unitPriceRetail: [null, [Validators.required, Validators.min(0.01)]],
    unitPriceWholesale: [null, [Validators.required, Validators.min(0.01)]],
    wholesalePriceBox: [null, [Validators.required, Validators.min(0.01)]],
    specialPriceBox: [null, [Validators.min(0.01)]],
    totalPieces: [null, [Validators.required, Validators.min(1)]],
    numberOfBoxes: [null, [Validators.required, Validators.min(1)]],
    minThreshold: [null, [Validators.required, Validators.min(0)]],
    supplier: [null, [Validators.required]],
  });

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadProducts();
    this.initializeFormForEdit();
  }

  private initializeFormForEdit(): void {
    if (this.modalData.isEdit && this.modalData.inventory) {
      this.isEditMode.set(true);
      const item = this.modalData.inventory;
      this.inventoryForm.patchValue({
        productId: item.product?.id,
        description: item.description,
        unitPriceRetail: item.retailUnitPrice,
        unitPriceWholesale: item.wholesaleUnitPrice,
        wholesalePriceBox: item.wholesalePrice,
        specialPriceBox: item.specialPrice,
        totalPieces: item.totalPieces,
        minThreshold: Number(item.minimumThreshold ?? 0),
        supplier: item.supplier?.id.toString(),
      });
    }
  }

  private loadSuppliers(): void {
    if (!this.supplierService.suppliers()) {
      this.supplierService.getSuppliers({ useCache: false, showLoader: true });
    }
  }

  private loadProducts(): void {
    if (!this.productService.products()) {
      this.productService.getProducts({ useCache: true, showLoader: true });
    }
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.inventoryForm.get(fieldName);
    return !!(field?.invalid && (field?.touched || field?.dirty));
  }

  public onSubmit(): void {
    if (this.inventoryForm.valid) {
      this.isSubmitting.set(true);
      const formData: AddInventoryInterface = this.inventoryForm.value;
      this.dialogRef.close({
        action: 'confirm',
        data: formData
      });

      this.isSubmitting.set(false);
    } else {
      Object.keys(this.inventoryForm.controls).forEach(key => {
        this.inventoryForm.get(key)?.markAsTouched();
      });
    }
  }

  public onCancel(): void {
    this.dialogRef.close({ action: 'cancel' });
    this.inventoryForm.reset();
  }
}

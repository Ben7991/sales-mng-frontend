import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, finalize, tap, Observable } from 'rxjs';
import { SnackbarService } from '@shared/services/snackbar/snackbar.service';
import { TOAST_MESSAGES } from '@shared/constants/general.constants';
import {
  getCategoriesUrl,
  getProductsUrl,
  updateCategoryUrl,
  updateProductUrl,
  changeProductImageUrl,
  productLiveSearchUrl,
  stockLiveSearchUrl
} from '@shared/constants/api.constants';
import {
  AddCategoryInterface,
  AddProductInterface,
  Category,
  CategoryApiResponse,
  GetCategoriesApiResponse,
  GetProductsApiResponse,
  Product,
  ProductApiResponse,
  UpdateCategoryInterface,
  UpdateProductImageInterface,
  UpdateProductInterface,
  ProductLiveSearchApiResponse
} from '../models/interface';
import { CATEGORIES_PAGE_SIZE, PRODUCTS_PAGE_SIZE } from '../constants/products.constant';

const DEFAULT_FETCH_OPTIONS: { useCache?: boolean, showLoader?: boolean } = {
  useCache: false,
  showLoader: true
};

@Injectable({
  providedIn: 'root'
})
export class ProductsManagementService {
  private readonly http = inject(HttpClient);
  private readonly snackbarService = inject(SnackbarService);

  // Categories
  public readonly categories = signal<Category[] | null>(null);
  public readonly isLoadingCategories = signal(false);
  public readonly categoriesCount = signal(0);
  public categorySearchQuery = '';
  public currentCategoryPage = 0;
  public currentCategoryPageSize = CATEGORIES_PAGE_SIZE;

  // Products
  public readonly products = signal<Product[] | null>(null);
  public readonly isLoadingProducts = signal(false);
  public readonly productsCount = signal(0);
  public productSearchQuery = '';
  public currentProductPage = 0;
  public currentProductPageSize = PRODUCTS_PAGE_SIZE;

  public getCategories({ useCache, showLoader } = DEFAULT_FETCH_OPTIONS): void {
    if (useCache && this.categories()) {
      return;
    }

    this.isLoadingCategories.set(showLoader ?? true);
    this.http.get<GetCategoriesApiResponse>(
      getCategoriesUrl(this.currentCategoryPageSize, this.currentCategoryPage, this.categorySearchQuery)
    )
      .pipe(
        tap((response) => {
          this.categories.set(response.data);
          this.categoriesCount.set(response.count);
        }),
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);
          return EMPTY;
        }),
        finalize(() => this.isLoadingCategories.set(false))
      )
      .subscribe();
  }

  public addCategory(categoryData: AddCategoryInterface): void {
    this.http.post<CategoryApiResponse>(
      getCategoriesUrl(this.currentCategoryPageSize, this.currentCategoryPage, this.categorySearchQuery),
      categoryData
    )
      .subscribe({
        next: () => {
          this.getCategories({ showLoader: false, useCache: false });
          this.snackbarService.showSuccess('Category added successfully');
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);
        }
      });
  }

  public updateCategory(categoryId: number, categoryData: UpdateCategoryInterface): void {
    this.http.patch<CategoryApiResponse>(updateCategoryUrl(categoryId), categoryData)
      .subscribe({
        next: () => {
          this.getCategories({ showLoader: false, useCache: false });
          this.snackbarService.showSuccess('Category updated successfully');
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);
        }
      });
  }

  public getProducts({ useCache, showLoader } = DEFAULT_FETCH_OPTIONS): void {
    if (useCache && this.products()) {
      return;
    }

    this.isLoadingProducts.set(showLoader ?? true);
    this.http.get<GetProductsApiResponse>(
      getProductsUrl(this.currentProductPageSize, this.currentProductPage, this.productSearchQuery)
    )
      .pipe(
        tap((response) => {
          this.products.set(response.data);
          this.productsCount.set(response.count);
        }),
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);
          return EMPTY;
        }),
        finalize(() => this.isLoadingProducts.set(false))
      )
      .subscribe();
  }

  public addProduct(productData: AddProductInterface): void {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('categoryId', productData.categoryId.toString());
    formData.append('file', productData.file);

    this.http.post<ProductApiResponse>(
      getProductsUrl(this.currentProductPageSize, this.currentProductPage, this.productSearchQuery),
      formData
    )
      .subscribe({
        next: () => {
          this.getProducts({ showLoader: false, useCache: false });
          this.snackbarService.showSuccess('Product added successfully');
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);
        }
      });
  }

  public updateProduct(productId: number, productData: UpdateProductInterface): void {
    this.http.patch<ProductApiResponse>(updateProductUrl(productId), productData)
      .subscribe({
        next: () => {
          this.getProducts({ showLoader: false, useCache: false });
          this.snackbarService.showSuccess('Product updated successfully');
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);
        }
      });
  }

  public updateProductImage(productId: number, imageData: UpdateProductImageInterface): void {
    const formData = new FormData();
    formData.append('file', imageData.file);

    this.http.post<ProductApiResponse>(changeProductImageUrl(productId), formData)
      .subscribe({
        next: () => {
          this.getProducts({ showLoader: false, useCache: false });
          this.snackbarService.showSuccess('Product image updated successfully');
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);
        }
      });
  }

  public searchProducts(query: string): Observable<ProductLiveSearchApiResponse> {
    return this.http.get<ProductLiveSearchApiResponse>(productLiveSearchUrl(query));
  }

  public searchStockProducts(query: string): Observable<ProductLiveSearchApiResponse> {
    return this.http.get<ProductLiveSearchApiResponse>(stockLiveSearchUrl(query));
  }
}

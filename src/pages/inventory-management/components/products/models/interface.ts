export type ProductStatus = 'IN_USE' | 'DISCONTINUED';

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  imagePath: string;
  status: ProductStatus;
  category: Category;
}

export interface GetCategoriesApiResponse {
  count: number;
  data: Category[];
}

export interface GetProductsApiResponse {
  count: number;
  data: Product[];
}

export interface AddCategoryInterface {
  name: string;
}

export interface UpdateCategoryInterface {
  name: string;
}

export interface AddProductInterface {
  name: string;
  categoryId: number;
  file: File;
}

export interface UpdateProductInterface {
  name: string;
  categoryId: number;
  status: ProductStatus;
}

export interface UpdateProductImageInterface {
  file: File;
}

export interface CategoryApiResponse {
  message: string;
  data: Category;
}

export interface ProductApiResponse {
  message: string;
  data: Product;
}

export interface ProductLiveSearchItem {
  id: number;
  name: string;
}

export interface ProductLiveSearchApiResponse {
  data: ProductLiveSearchItem[];
}

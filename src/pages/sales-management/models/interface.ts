import {Category, ProductStatus} from '../../inventory-management/components/products/models/interface';

export interface salesOrder {
  "id": number,
  "createdAt": Date,
  "customer": string,
  "amountPaid": number,
  "orderStatus": orderStatus,
  "orderTotal": number,
  "paidStatus": PaidStatus
}

export interface APISalesOrderResponse {
  "count": number,
  "data": salesOrder[]
}

export type PaidStatus = 'PAID' | 'OUTSTANDING' ;
export type orderStatus = 'OPEN' | 'DELIVERED' ;

export interface ProductI{
  id?: number;
  name?: string;
  imagePath?: string;
  status?: ProductStatus;
  category?: Category;
  orderType?: string;
  quantity?: number;
  price?: number;
}

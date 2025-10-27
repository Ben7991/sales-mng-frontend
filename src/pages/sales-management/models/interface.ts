import {Category} from '../../inventory-management/components/products/models/interface';

export interface SalesOrder {
  "id": number,
  "createdAt": Date,
  "customer": string,
  "amountPaid": number,
  "orderStatus": orderStatus,
  "orderTotal": number,
  "paidStatus": PaidStatus
}
export type ProductStatus = 'IN_USE' | 'DISCONTINUED';
export interface APISalesOrderResponse {
  "count": number,
  "data": SalesOrder[]
}

export type PaidStatus = 'PAID' | 'OUTSTANDING' ;
export type orderStatus = 'OPEN' | 'DELIVERED' ;
export type orderSale = 'WHOLESALE' | 'RETAIL' | 'SPECIAL_PURCHASE' ;
export type paymentMode = 'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY' |'CHEQUE' ;

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

export interface CreateOrderRequest {
  orderItems: OrderItem[];
  orderSale: orderSale;
  paymentMode: paymentMode;
  amountPaid: number;
  customer: string;
}

export interface OrderItem {
  stockId: number;
  quantity: number;
}

import {Category} from '../../../../inventory-management/components/products/models/interface';

export interface SalesOrder {
  "id": number,
  "createdAt": Date,
  "customer": string,
  "amountPaid": number,
  "orderStatus": OrderStatus,
  "orderTotal": number,
  "paidStatus": PaidStatus,
  "commenet"?: string
}
export type ProductStatus = 'IN_USE' | 'DISCONTINUED';
export interface APISalesOrderResponse {
  "count": number,
  "data": SalesOrder[]
}

export type PaidStatus = 'PAID' | 'OUTSTANDING' ;
export type OrderStatus = 'OPEN' | 'DELIVERED' | 'DEEMED_SATISFIED' | 'CANCELLED';
export type OrderSale = 'WHOLESALE' | 'RETAIL' | 'SPECIAL_PURCHASE' ;
export type PaymentMode = 'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY' |'CHEQUE' ;

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
  orderSale: OrderSale;
  customer: string;
  comment?: string;
}

export interface UpdateOrderRequest {
  orderItems: OrderItem[];
  orderSale: OrderSale;
  customer: string;
  comment?: string;
}

export interface OrderItem {
  stockId: number;
  quantity: number;
}

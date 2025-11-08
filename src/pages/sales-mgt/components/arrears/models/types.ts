export interface Customer {
  customerId: number;
  customerName: string;
  totalOrders: number;
  totalAmountToPay: number;
  lastDatePaid: string;
}

export interface GetArrearsApiResponse {
  count: number;
  data: Customer[];
}

export interface ArrearDetail {
  orderId: number;
  orderTotal: number;
  amountPaid: number;
  outstandingAmount: number;
}

export interface ArrearsDetailsData {
  customerName: string;
  customerId: string;
  orders: ArrearDetail[];
}

export interface GetArrearDetailsApiResponse {
  data: ArrearDetail[];
}

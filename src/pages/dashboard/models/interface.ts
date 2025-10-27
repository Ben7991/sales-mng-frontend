export interface DashboardSummaryResponse {
  data: {
    summary: DashboardSummary;
  };
}

export interface DashboardSummary {
  totalCategories: number;
  totalCustomers: number;
  totalSuppliers: number;
  totalProducts: number;
  orders: {
    paidPercent: number;
    outstandingPercent: number;
  };
}
export interface OrderSummaryItem {
  total: number;
  month: string;
}

export interface OrderSummaryResponse {
  data: OrderSummaryItem[];
}

export interface HighValueCustomer {
  name: string;
  percent: number;
}

export interface HighValueCustomersResponse {
  data: HighValueCustomer[];
}

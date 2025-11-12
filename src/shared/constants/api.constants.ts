import environment from "@shared/environments/environment";

/* AUTH */
export const AUTH_LOGIN_URL = `${environment.serverUrl}/auth/login`;
export const AUTH_LOGOUT_URL = `${environment.serverUrl}/auth/logout`;
export const AUTH_FORGOT_PASSWORD_URL = `${environment.serverUrl}/auth/forgot-password`;
export const AUTH_RESET_PASSWORD_URL = `${environment.serverUrl}/auth/reset-password`;
export const AUTH_REFRESH_TOKEN_URL = `${environment.serverUrl}/auth/refresh-token`;
export const GET_AUTH_USER = `${environment.serverUrl}/auth/user`;
export const AUTH_USER_UPDATE = `${environment.serverUrl}/users/change-personal-info`;
export const AUTH_IN_APP_PASSWORD_CHANGE = `${environment.serverUrl}/users/change-password`;

/* USERS */
export const GET_USERS_URL = `${environment.serverUrl}/users`;
export const UPDATE_USER_INFO = `${environment.serverUrl}/users/{id}`;
export const CHNANGE_USER_STATUS = `${environment.serverUrl}/users/{id}/change-status`;

/* SALES */
export const getSalesOrdersUrl = `${environment.serverUrl}/sales`;
export const changeOrderStatusUrl = (id: string | number) =>
  `${environment.serverUrl}/sales/${id}/order-delivered`;

export const getOrderUrl = (id: number) =>
  `${environment.serverUrl}/sales/${id}`;

export const getSalesReceiptDataUrl = (id: number) =>
  `${environment.serverUrl}/sales/${id}/print-receipt`;

export const getUpdateOrderPaymentUrl = (id: number) =>
  `${environment.serverUrl}/sales/${id}/add-payment`;

/*ARREARS*/
export const getArrearsUrl = (perPage: number, page: number, q: string): string => {
  const params = new URLSearchParams();
  params.set('perPage', perPage.toString());
  params.set('page', page.toString());
  if (q) {
    params.set('q', q);
  }
  return `${environment.serverUrl}/report/arrears?${params.toString()}`;
};

export const getArrearDetailsUrl = (customerId: number): string =>
  `${environment.serverUrl}/report/arrears/${customerId}`;

/* SUPPLIERS */
export const getSuppliersUrl =
  (limit: number, page: number, query: string) => `${environment.serverUrl}/suppliers?perPage=${limit}&page=${page}&q=${query}`;

export const supplierBasicInfoUpdateUrl =
  (supplierId: number) => `${environment.serverUrl}/suppliers/${supplierId}`;

export const supplierStatusChangeUrl =
  (supplierId: number) => `${environment.serverUrl}/suppliers/${supplierId}/change-status`;

export const supplierContactAdditionUrl =
  (supplierId: number) => `${environment.serverUrl}/suppliers/${supplierId}/phone`;

export const supplierContactDeletionUrl =
  (supplierId: number, phoneId: number) => `${environment.serverUrl}/suppliers/${supplierId}/phone/${phoneId}`;

/* CUSTOMERS */
export const getCustomersUrl =
  (limit: number, page: number, query: string) => `${environment.serverUrl}/customers?perPage=${limit}&page=${page}&q=${query}`;

export const customerBasicInfoUpdateUrl =
  (customerId: number) => `${environment.serverUrl}/customers/${customerId}`;

export const customerContactAdditionUrl =
  (customerId: number) => `${environment.serverUrl}/customers/${customerId}/phone`;

export const customerContactDeletionUrl =
  (customerId: number, phoneId: number) => `${environment.serverUrl}/customers/${customerId}/phone/${phoneId}`;

export const customerLiveSearchUrl =
  (query: string) => `${environment.serverUrl}/customers/live-search?q=${query}`;

// Inventory
export const getInventoryUrl = `${environment.serverUrl}/products/stocks`
export const addInventoryUrl = `${environment.serverUrl}/products/restock`
export const getStockHistoryUrl = `${environment.serverUrl}/products/restock-history`
export const updateInventoryUrl = (inventoryId: number): string =>
  `${environment.serverUrl}/products/restock/${inventoryId}`;

/* PRODUCTS & CATEGORIES */
export const getCategoriesUrl =
  (limit: number, page: number, query: string) => `${environment.serverUrl}/categories?perPage=${limit}&page=${page}&q=${query}`;

export const updateCategoryUrl =
  (id: number) => `${environment.serverUrl}/categories/${id}`;

export const getProductsUrl =
  (limit: number, page: number, query: string) => `${environment.serverUrl}/products?perPage=${limit}&page=${page}&q=${query}`;

export const updateProductUrl =
  (id: number) => `${environment.serverUrl}/products/${id}`;

export const changeProductImageUrl =
  (id: number) => `${environment.serverUrl}/products/${id}/change-image`;

export const productLiveSearchUrl =
  (query: string) => `${environment.serverUrl}/products/live-search?q=${query}`;


/*DASHBOARD*/
export const getSummaryUrl = `${environment.serverUrl}/dashboard/summary`;
export const getOrderSummaryUrl = `${environment.serverUrl}/dashboard/order-summary`;
export const getHighValueCustomersUrl = `${environment.serverUrl}/dashboard/high-value-customers`;

/* REPORTS */
export const getMoneyShareUrl = (
  perPage: number,
  page: number,
  q: string,
  startDate?: string,
  endDate?: string
): string => {
  const params = new URLSearchParams();
  params.set('perPage', perPage.toString());
  params.set('page', page.toString());
  if (q) {
    params.set('q', q);
  }
  if (startDate) {
    params.set('startDate', startDate.toString());
  }
  if (endDate) {
    params.set('endDate', endDate.toString());
  }
  return `${environment.serverUrl}/report/money-sharing?${params.toString()}`;
};

import environment from "@shared/environments/environment";

/* AUTH */
export const AUTH_LOGIN_URL = `${environment.serverUrl}/api/auth/login`;
export const AUTH_FORGOT_PASSWORD_URL = `${environment.serverUrl}/api/auth/forgot-password`;
export const AUTH_RESET_PASSWORD_URL = `${environment.serverUrl}/api/auth/reset-password`;
export const AUTH_REFRESH_TOKEN_URL = `${environment.serverUrl}/api/auth/refresh-token`;
export const GET_AUTH_USER = `${environment.serverUrl}/api/auth/user`;
export const AUTH_USER_UPDATE = `${environment.serverUrl}/api/users/change-personal-info`;
export const AUTH_IN_APP_PASSWORD_CHANGE = `${environment.serverUrl}/api/users/change-password`;

/* USERS */
export const GET_USERS_URL = `${environment.serverUrl}/api/users`;
export const UPDATE_USER_INFO = `${environment.serverUrl}/api/users/{id}`;
export const CHNANGE_USER_STATUS = `${environment.serverUrl}/api/users/{id}/change-status`;

/* SALES */
export const getSalesOrdersUrl =`${environment.serverUrl}/api/sales`;
export const changeOrderStatusUrl = (id: string | number) =>
  `${environment.serverUrl}/api/sales/${id}/order-delivered`;

/* SUPPLIERS */
export const getSuppliersUrl =
    (limit: number, page: number, query: string) => `${environment.serverUrl}/api/suppliers?perPage=${limit}&page=${page}&q=${query}`;

export const supplierBasicInfoUpdateUrl =
    (supplierId: number) => `${environment.serverUrl}/api/suppliers/${supplierId}`;

export const supplierStatusChangeUrl =
    (supplierId: number) => `${environment.serverUrl}/api/suppliers/${supplierId}/change-status`;

export const supplierContactAdditionUrl =
    (supplierId: number) => `${environment.serverUrl}/api/suppliers/${supplierId}/phone`;

export const supplierContactDeletionUrl =
    (supplierId: number, phoneId: number) => `${environment.serverUrl}/api/suppliers/${supplierId}/phone/${phoneId}`;

/* CUSTOMERS */
export const getCustomersUrl =
    (limit: number, page: number, query: string) => `${environment.serverUrl}/api/customers?perPage=${limit}&page=${page}&q=${query}`;

export const customerBasicInfoUpdateUrl =
    (customerId: number) => `${environment.serverUrl}/api/customers/${customerId}`;

export const customerContactAdditionUrl =
    (customerId: number) => `${environment.serverUrl}/api/customers/${customerId}/phone`;

export const customerContactDeletionUrl =
    (customerId: number, phoneId: number) => `${environment.serverUrl}/api/customers/${customerId}/phone/${phoneId}`;

export const customerLiveSearchUrl =
    (query: string) => `${environment.serverUrl}/api/customers/live-search?q=${query}`;

// Inventory
export const getInventoryUrl = `${environment.serverUrl}/api/products/stocks`
export const addInventoryUrl =  `${environment.serverUrl}/api/products/restock`
export const getStockHistoryUrl = `${environment.serverUrl}/api/products/restock-history`
export const updateInventoryUrl = (inventoryId: number): string =>
  `${environment.serverUrl}/api/products/restock/${inventoryId}`;

/* PRODUCTS & CATEGORIES */
export const getCategoriesUrl =
    (limit: number, page: number, query: string) => `${environment.serverUrl}/api/categories?perPage=${limit}&page=${page}&q=${query}`;

export const updateCategoryUrl =
    (id: number) => `${environment.serverUrl}/api/categories/${id}`;

export const getProductsUrl =
    (limit: number, page: number, query: string) => `${environment.serverUrl}/api/products?perPage=${limit}&page=${page}&q=${query}`;

export const updateProductUrl =
    (id: number) => `${environment.serverUrl}/api/products/${id}`;

export const changeProductImageUrl =
    (id: number) => `${environment.serverUrl}/api/products/${id}/change-image`;

export const productLiveSearchUrl =
    (query: string) => `${environment.serverUrl}/api/products/live-search?q=${query}`;



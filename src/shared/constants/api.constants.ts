import environment from "@shared/environments/environment";

/* AUTH */
export const AUTH_LOGIN_URL = `${environment.serverUrl}/auth/login`;
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

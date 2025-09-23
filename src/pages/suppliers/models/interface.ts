export interface SupplierPhone {
  id: number;
  phone: string;
}

export interface Supplier {
  id: number;
  name: string;
  companyName: string;
  email: string;
  status: SupplierStatusInterface['status'];
  supplierPhones: SupplierPhone[];
}

export interface GetSupplierApiResponse {
  count: number;
  data: Supplier[];
}

export interface AddSupplierInterface {
  name: string;
  companyName: string;
  email: string;
  phones: string[];
}

export interface AddSupplierApiResponse {
  message?: string;
  data?: Supplier;
}

export interface UpdateSupplierInterface {
  name: string;
  companyName: string;
  email: string;
}

export interface SupplierStatusInterface {
  status: 'ACTIVE' | 'IN_ACTIVE';
}

export interface AddPhoneInterface {
  phone: string;
}

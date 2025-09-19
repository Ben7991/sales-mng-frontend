export interface SupplierPhone {
  id: number;
  phone: string;
}

export interface Supplier {
  id: number;
  name: string;
  companyName: string;
  email: string;
  status: 'ACTIVE' | 'IN_ACTIVE';
  supplierPhones: SupplierPhone[];
}

export interface SupplierArrayResponse {
  data: {
    count: number;
    data: Supplier[];
  };
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

export interface ChangeStatusInterface {
  status: 'ACTIVE' | 'IN_ACTIVE';
}

export interface AddPhoneInterface {
  phone: string;
}

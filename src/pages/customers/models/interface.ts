export interface CustomerPhone {
  id: number;
  phone: string;
}

export interface Customer {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  address: string;
  customerPhones: CustomerPhone[];
}

export interface GetCustomerApiResponse {
  count: number;
  data: Customer[];
}

export interface AddCustomerInterface {
  name: string;
  address: string;
  phones: string[];
}

export interface AddCustomerApiResponse {
  message?: string;
  data?: Customer;
}

export interface UpdateCustomerInterface {
  name: string;
  address: string;
}

export interface AddPhoneInterface {
  phone: string;
}

export interface LiveSearchCustomerResponse {
  data: {
    id: number;
    name: string;
  }[];
}
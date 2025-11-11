export interface MoneyShareSupplier {
  id: number;
  name: string;
  companyName: string;
  email: string;
  status: string;
}

export interface MoneyShareData {
  id: number;
  createdAt: string;
  amount: number;
  supplier: MoneyShareSupplier;
}

export interface MoneyShareResponse {
  count: number;
  bonus: number;
  data: MoneyShareData[];
}

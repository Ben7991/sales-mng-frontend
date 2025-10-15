export interface supplier {
  "id": 10,
  "name": string,
  "companyName": string,
  "email": string,
  "status": string
}

export interface product {
  "id": number,
  "name": string,
  "imagePath": string,
  "status": string
}

export interface Inventory {
  "id": number,
  description?: string;
  "retailUnitPrice": string,
  "wholesaleUnitPrice": string,
  "specialPrice": string,
  "wholesalePrice": string,
  "totalPieces": number,
  "numberOfBoxes": number,
  "minimumThreshold": number,
  "product": product,
  "supplier":supplier
  status: string;
}

export interface AddInventoryInterface{
  productId: number;
  retailUnitPrice: number | null;
  wholesaleUnitPrice: number | null;
  specialPrice: number | null;
  wholesalePrice: number | null;
  totalPieces: number | null;
  numberOfBoxes: number | null;
  minimumThreshold: number | null;
  supplierId: number;
  description: string;
  status?: string;
}
export interface inventoryResponse {
  count: number,
  data: Inventory[]
}

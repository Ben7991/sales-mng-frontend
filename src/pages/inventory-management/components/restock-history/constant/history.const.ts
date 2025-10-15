import { TableAction, TableColumn } from '@shared/components/user-management/table/interface/interface';
import {SearchConfig} from '@shared/components/search/interface';

export const stockHistoryTableColumns: TableColumn[] = [
  { key: 'product.name', label: 'Product Name', sortable: true, width: '200px', },
  { key: 'retailUnitPrice', label: 'Unit price (Retail)', sortable: false, formatter: (value: string) => value ? `GH₵ ${value}` : '-' },
  { key: 'wholesaleUnitPrice', label: 'Unit price (wholesale)', sortable: true,  formatter: (value: string) => value ? `GH₵ ${value}` : '-' },
  { key: 'specialPrice', label: 'Special price', sortable: false,  formatter: (value: string) => value ? `GH₵ ${value}` : '-' },
  { key: 'supplier.companyName', label: 'Supplier', sortable: false, width: '120px' },
  { key: 'numberOfBoxes', label: 'Boxes', sortable: false, width: '120px' },
  { key: 'timestamp', label: 'Date', sortable: true, width: '180px' }
];

export const stockHistoryTableActions: TableAction[] = [
  { label: 'View details', action: 'ViewDetail' }
];

export const inventoryHistorySearchConfig: SearchConfig = {
  placeholder: 'Search inventory history',
  searchFields: ['name', 'email'],
  appearance: 'outline',
  debounceTime: 300,
  caseSensitive: false,
  minLength: 0,
};

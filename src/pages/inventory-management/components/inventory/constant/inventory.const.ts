import { SearchConfig } from '@shared/components/search/interface';
import { TableAction, TableColumn } from '@shared/components/user-management/table/interface/interface';

export const INVENTORY_PAGE_SIZE = 10;

export const inventorySearchConfig: SearchConfig = {
  placeholder: 'Search inventory',
  searchFields: ['name', 'email'],
  appearance: 'outline',
  debounceTime: 300,
  caseSensitive: false,
  minLength: 0,
};

export const inventoryTableColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'Product name',
    sortable: true,
    formatter: (value: any, row: any) => row.product?.name || '-'
  },
  {
    key: 'retailUnitPrice',
    label: 'Unit Price(Retail)',
    sortable: false,
    formatter: (value: string) => value ? `GH₵ ${value}` : '-'
  },
  {
    key: 'wholesaleUnitPrice',
    label: 'Unit Price(wholesale)',
    sortable: false,
    formatter: (value: string) => value ? `GH₵ ${value}` : '-'
  },
  {
    key: 'specialPrice',
    label: 'Special price',
    sortable: true,
    formatter: (value: string) => value ? `GH₵ ${value}` : '-'
  },
  {
    key: 'supplier',
    label: 'Supplier',
    sortable: true,
    formatter: (value: any, row: any) => row.supplier?.name || '-'
  },
  {
    key: 'numberOfBoxes',
    label: 'Boxes',
    sortable: true
  },
  {
    key: 'status',
    label: 'Status',
    type: 'status',
    sortable: true,
    formatter: (value: any, row: any) => {
      const status = row.status || 'UNKNOWN';
      return String(status).replace(/_/g, ' ');
    }
  }
];

export const inventoryTableActions: TableAction[] = [
  { label: 'Restock', action: 'edit' },
];

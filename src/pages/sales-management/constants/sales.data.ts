import {SearchConfig} from '@shared/components/search/interface';
import {TableAction, TableColumn} from '@shared/components/user-management/table/interface/interface';

export const salesSearchConfig: SearchConfig = {
  placeholder: 'Search order',
  searchFields: ['customer', 'orderStatus','paidStatus'],
  appearance: 'outline',
  debounceTime: 600,
  caseSensitive: false,
  minLength: 0,
};

export const salesTableColumns: TableColumn[] = [
  {
    key: 'id',
    label: 'Order No.',
    sortable: true,
    type: 'text'
  },
  {
    key: 'createdAt',
    label: 'Order Date',
    sortable: true,
    type: 'text',
    formatter: (value: any) => {
      if (!value) return '—';
      const date = new Date(value);
      const yy = date.getFullYear().toString().slice(-2);
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${dd}/${mm}/${yy}`;
    },
  },
  {
    key: 'customer',
    label: 'Customer',
    sortable: true,
    type: 'text'
  },
  {
    key: 'orderTotal',
    label: 'Order Total',
    sortable: false,
    type: 'text'
  },
  {
    key: 'orderStatus',
    label: 'Order Status',
    sortable: true,
    type: 'status',
    formatter: (value: any) => value
      ? value.toString().replace(/_/g, ' ')
      : 'Unknown'
  },
  {
    key: 'amountPaid',
    label: 'Amount Paid',
    sortable: false,
    type: 'text'
  },
  {
    key: 'paidStatus',
    label: 'Paid Status',
    sortable: true,
    type: 'status',
    formatter: (value: any) => value
      ? value.toString().replace(/_/g, ' ')
      : 'Unknown'
  }
];

export const salesTableActions: TableAction[] = [
  {
    label: 'Mark as Delivered',
    action: 'edit'
  },
];

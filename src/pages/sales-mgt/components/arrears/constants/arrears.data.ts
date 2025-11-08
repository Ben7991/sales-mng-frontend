import {TableColumn} from '@shared/components/user-management/table/interface/interface';
import {SearchConfig} from '@shared/components/search/interface';

export  const ARREARS_PAGE_SIZE = 10;

export const arrearsSearchConfig: SearchConfig = {
  placeholder: 'Search arrears',
  searchFields: ['customerName', 'lastDatePaid',],
  appearance: 'outline',
  debounceTime: 600,
  caseSensitive: false,
  minLength: 0,
};

export const arrearsTableColumns: TableColumn[] = [
  {
    key: 'customerName',
    label: 'Customer name',
    sortable: false,
    type: 'text'
  },
  {
    key: 'totalOrders',
    label: 'No. of order(s)',
    sortable: false,
    type: 'text'
  },
  {
    key: 'totalAmountToPay',
    label: 'Total Amount',
    sortable: false,
    type: 'text',
    formatter: (value: string) => value ? `GH₵ ${value}` : '-'
  },
  {
    key: 'lastDatePaid',
    label: 'Last Paid',
    sortable: false,
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
];

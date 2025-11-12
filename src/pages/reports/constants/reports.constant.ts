import { TableColumn } from '@shared/components/user-management/table/interface/interface';
import { SearchConfig } from '@shared/components/search/interface';

export const REPORTS_PAGE_SIZE = 10;

export const reportsTableColumns: TableColumn[] = [
  { 
    key: 'createdAt', 
    label: 'Date', 
    type: 'text',
    formatter: (value: string) => {
      const date = new Date(value);
      const day = date.getDate();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  },
  { key: 'supplier.id', label: 'Supplier ID', type: 'text' },
  { key: 'supplier.name', label: 'Supplier name', type: 'text' },
  { key: 'amount', label: 'Total amount', type: 'text' }
];

export const reportsSearchConfig: SearchConfig = {
  placeholder: 'Search report...'
};

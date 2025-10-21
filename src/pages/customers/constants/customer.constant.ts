import { TableColumn, TableAction } from '@shared/components/user-management/table/interface/interface';
import { SearchConfig } from '@shared/components/search/interface';

export const CUSTOMERS_PAGE_SIZE = 10;

export const customerTableColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    type: 'text'
  },
  {
    key: 'address',
    label: 'Address',
    sortable: true,
    type: 'text'
  },
  {
    key: 'phone',
    label: 'Phone',
    sortable: false,
    type: 'text'
  }
];

export const customerTableActions: TableAction[] = [
  {
    icon: 'edit',
    label: 'Edit',
    action: 'edit'
  },
];

export const customerSearchConfig: SearchConfig = {
  placeholder: 'Search customers',
  searchFields: ['name', 'address'],
  debounceTime: 600
};
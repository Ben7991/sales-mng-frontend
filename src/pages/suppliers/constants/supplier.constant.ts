import { TableColumn, TableAction } from '@shared/components/user-management/table/interface/interface';
import { SearchConfig } from '@shared/components/search/interface';

export const supplierTableColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    type: 'text'
  },
  {
    key: 'companyName',
    label: 'Company',
    sortable: true,
    type: 'text'
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    type: 'text'
  },
  {
    key: 'phone',
    label: 'Phone',
    sortable: false,
    type: 'text'
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    type: 'status'
  }
];

export const supplierTableActions: TableAction[] = [
  {
    icon: 'edit',
    label: 'Edit',
    action: 'edit'
  },
];

export const supplierSearchConfig: SearchConfig = {
  placeholder: 'Search suppliers...',
  searchFields: ['name', 'companyName', 'email'],
  debounceTime: 600
};

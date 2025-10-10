import { SearchConfig } from '@shared/components/search/interface';
import { TableAction, TableColumn } from '@shared/components/user-management/table/interface/interface';
import { toTitleCase } from '@shared/utils/string.util';

export const CATEGORIES_PAGE_SIZE = 40;
export const PRODUCTS_PAGE_SIZE = 25;

export const categorySearchConfig: SearchConfig = {
  placeholder: 'Search category',
  debounceTime: 600,
  showClearButton: true,
  width: '100%'
};

export const productSearchConfig: SearchConfig = {
  placeholder: 'Search product',
  debounceTime: 600,
  showClearButton: true,
  width: '100%'
};

export const categoryTableColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'Category name',
    sortable: true,
    width: '100%'
  }
];

export const categoryTableActions: TableAction[] = [
  {
    action: 'edit',
    label: 'Edit',
    icon: 'edit'
  }
];

export const productTableColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'Product name',
    sortable: true,
    width: '25%'
  },
  {
    key: 'category',
    label: 'Category',
    sortable: true,
    width: '20%',
    formatter: (value: any) => toTitleCase(value.name)
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: '20%',
    type: 'status',
    formatter: (value: string) => {
      return value === 'IN_USE' ? 'In use' : 'Discontinued';
    }
  }
];

export const productTableActions: TableAction[] = [
  {
    action: 'edit',
    label: 'Edit',
    icon: 'edit'
  }
];

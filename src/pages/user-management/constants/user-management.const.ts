import {TableAction, TableColumn} from '@shared/components/user-management/table/interface/interface';
import {SearchConfig} from '@shared/components/search/interface';

export const userTableColumns:TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true, width: '200px' },
  { key: 'email', label: 'Email', sortable: false, width: '250px' },
  { key: 'username', label: 'User Name', sortable: false, width: '200px' },
  { key: 'role', label: 'Role', sortable: true, width: '100px' },
  { key: 'status', label: 'Status', type: 'status', sortable: true, width: '50px' }
]

export const userTableActions:TableAction[] = [
  {  label: 'Edit', action: 'edit' },
  { label: 'View', action: 'view' }
]

export const userSearchConfig: SearchConfig = {
  placeholder: 'Search users by name or email...',
  searchFields: ['name', 'email'],
  appearance: 'outline',
  debounceTime: 300,
  caseSensitive: false,
  minLength: 1,
};

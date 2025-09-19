export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'status' | 'actions';
  width?: string;
  formatter?: (value: any, row?: any) => string;
}

export interface TableAction {
  icon?: string;
  label: string;
  action: string;
}

export interface StatusConfig {
  [key: string]: {
    color: string;
    backgroundColor: string;
  };
}

import {TableColumn} from '@shared/components/user-management/table/interface/interface';

export const arrearDetailsTableColumns: TableColumn[] = [
  {
    key: 'orderId',
    label: 'Order No.',
    sortable: true,
    type: 'text'
  },
  {
    key: 'orderTotal',
    label: 'Order Total',
    sortable: false,
    type: 'text',
    formatter: (value: number) => `GH₵ ${value.toFixed(2)}`
  },
  {
    key: 'amountPaid',
    label: 'Amount Paid',
    sortable: false,
    type: 'text',
    formatter: (value: number) => `GH₵ ${value.toFixed(2)}`
  },
  {
    key: 'outstandingAmount',
    label: 'Outstanding Amount',
    sortable: false,
    type: 'text',
    formatter: (value: number) => `GH₵ ${value.toFixed(2)}`
  },
];

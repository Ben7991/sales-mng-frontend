import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatIconModule} from '@angular/material/icon';
import {NgStyle, NgTemplateOutlet, TitleCasePipe} from '@angular/common';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIconButton} from '@angular/material/button';
import {StatusConfig, TableAction, TableColumn} from './interface/interface';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {PaginatorComponent} from '@shared/components/paginator/paginator.component';

@Component({
  selector: 'app-table',
  imports: [
    MatIconModule,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatMenuItem,
    MatMenuTrigger,
    MatCellDef,
    MatHeaderCellDef,
    MatCheckbox,
    MatTable,
    MatSort,
    NgStyle,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef,
    MatRow,
    MatMenu,
    MatIconButton,
    MatProgressSpinner,
    MatSortHeader,
    PaginatorComponent,
    NgTemplateOutlet
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columns = input<TableColumn[]>([]);
  data = input<any[]>([]);
  loading = input(false);
  showCheckboxes = input(true);
  showPagination = input(true);
  pageSize = input(0);
  currentPage = input<number>(0);
  isRowClickable = input(false);
  totalItems = input<number | undefined>(0);
  pageSizeOptions = input<number[]>([]);
  actions = input<TableAction[]>([]);
  actionsTemplate = input<TemplateRef<any> | null>(null); // Custom template for actions
  statusConfig = input.required<StatusConfig>();

  selectionChange = output<any[]>();
  actionClick = output<{ action: string; item: any }>();
  pageChange = output<PageEvent>();
  clickedRow = output<any>();

  private readonly selection = signal(new SelectionModel<any>(true, []));
  private readonly titleCasePipe = new TitleCasePipe();

  displayedColumns = computed(() => {
    const cols: string[] = [];

    if (this.showCheckboxes()) {
      cols.push('select');
    }

    cols.push(...this.columns().map((col) => col.key));

    // Show actions column if either actions array or custom template is provided
    if (this.actions().length > 0 || this.actionsTemplate()) {
      cols.push('actions');
    }

    return cols;
  });

  isAllSelected = computed(() => {
    const numSelected = this.selection().selected.length;
    const numRows = this.data().length;
    return numSelected === numRows && numRows > 0;
  });

  hasValue = computed(() => this.selection().hasValue());
  isIndeterminate = computed(() => this.hasValue() && !this.isAllSelected());

  constructor() {
    effect(() => {
      const selectedItems = this.selection().selected;
      this.selectionChange.emit(selectedItems);
    });
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
      });
    }
  }

  toggleAllRows() {
    const currentSelection = this.selection();

    if (this.isAllSelected()) {
      currentSelection.clear();
    } else {
      this.data().forEach((row) => currentSelection.select(row));
    }

    this.selection.set(currentSelection);
  }

  toggleRow(row: any) {
    const currentSelection = this.selection();
    currentSelection.toggle(row);

    this.selection.set(currentSelection);
  }

  isRowSelected(row: any): boolean {
    return this.selection().isSelected(row);
  }

  onRowClick(row: any) {
    this.clickedRow.emit(row);
  }

  onActionClick(action: string, item: any) {
    this.actionClick.emit({ action, item });
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  getStatusStyles(status: string) {
    const config = this.statusConfig()[status];
    if (config) {
      return {
        color: config.color,
        backgroundColor: config.backgroundColor
      };
    }
    return {};
  }

  getSelection() {
    return this.selection();
  }

  getCellValue(element: any, column: TableColumn): any {
    if (column.formatter) {
      return column.formatter(element[column.key], element);
    }

    if (column.key.includes('.')) {
      return column.key.split('.').reduce((obj, key) => obj?.[key], element);
    }

    return element[column.key];
  }

  getStatusValue(element: any, column: TableColumn): string {
    const value = this.getCellValue(element, column);
    return value != null ? String(value) : '';
  }

  formatCellValue(element: any, column: TableColumn): string {
    const value = this.getCellValue(element, column);

    if (value == null) {
      return '-';
    }

    if (typeof value === 'number') {
      return value.toString();
    }

    if (typeof value === 'string') {
      if (column.type === 'status') {
        return this.titleCasePipe.transform(value);
      }
      return value;
    }

    return String(value);
  }
}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  ViewChild
} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
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
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatIconModule} from '@angular/material/icon';
import {NgStyle, TitleCasePipe} from '@angular/common';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIconButton} from '@angular/material/button';
import {StatusConfig, TableAction, TableColumn} from '@shared/components/user-management/table/interface/interface';
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
    MatSortHeader,
    TitleCasePipe,
    MatProgressSpinner,
    PaginatorComponent
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  columns = input<TableColumn[]>([]);
  data = input<any[]>([]);
  loading = input(false);
  showCheckboxes = input(true);
  showPagination = input(true);
  pageSize = input(0);
  currentPage = input<number>(0);
  totalItems = input<number | undefined>(0)
  pageSizeOptions = input<number[]>([]);
  actions = input<TableAction[]>([]);
  statusConfig = input.required<StatusConfig>();


  selectionChange = output<any[]>();
  actionClick = output<{ action: string; item: any }>();
  pageChange = output<PageEvent>();

  private dataSource = signal(new MatTableDataSource<any>([]));
  private selection = signal(new SelectionModel<any>(true, []));

  displayedColumns = computed(() => {
    const cols: string[] = [];

    if (this.showCheckboxes()) {
      cols.push('select');
    }

    cols.push(...this.columns().map((col) => col.key));

    if (this.actions().length > 0) {
      cols.push('actions');
    }

    return cols;
  });

  isAllSelected = computed(() => {
    const numSelected = this.selection().selected.length;
    const numRows = this.dataSource().data.length;
    return numSelected === numRows;
  });

  hasValue = computed(() => this.selection().hasValue());

  isIndeterminate = computed(() => {
    return this.hasValue() && !this.isAllSelected();
  });

  constructor() {
    // Effect to update data source when data changes
    effect(() => {
      const currentDataSource = this.dataSource();
      currentDataSource.data = this.data();
      this.dataSource.set(currentDataSource);
    });

    // Effect to update selection model and emit changes
    effect(() => {
      const selectedItems = this.selection().selected;
      this.selectionChange.emit(selectedItems);
    });
  }

  ngAfterViewInit() {
    this.dataSource().sort = this.sort;
  }

  toggleAllRows() {
    const currentSelection = this.selection();

    if (this.isAllSelected()) {
      currentSelection.clear();
    } else {
      this.dataSource().data.forEach((row) => currentSelection.select(row));
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

  getDataSource() {
    return this.dataSource();
  }

  getSelection() {
    return this.selection();
  }

}

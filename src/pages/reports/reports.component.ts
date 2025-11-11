import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SearchConfig } from '@shared/components/search/interface';
import { SearchComponent } from '@shared/components/search/search.component';
import { TableColumn } from '@shared/components/user-management/table/interface/interface';
import { TableComponent } from '@shared/components/user-management/table/table.component';
import { Subject, takeUntil } from 'rxjs';
import { reportsSearchConfig, reportsTableColumns } from './constants/reports.constant';
import { ReportsService } from './services/reports.service';

@Component({
  selector: 'app-reports',
  imports: [
    SearchComponent,
    TableComponent,
    MatProgressSpinner,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    DecimalPipe
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent implements OnInit, OnDestroy {
  protected readonly reportsService = inject(ReportsService);

  protected readonly searchTerm = signal<string>('');
  protected readonly tableColumns: TableColumn[] = reportsTableColumns;
  protected readonly searchConfig: SearchConfig = reportsSearchConfig;

  private readonly destroy$ = new Subject<void>();

  readonly dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  ngOnInit() {
    this.reportsService.getMoneyShareReport({ useCache: true });

    // Listen to date range changes
    this.dateRange.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onDateRangeChange();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onSearchTermChange(term: string) {
    this.searchTerm.set(term);
    this.reportsService.searchQuery = term;
    this.reportsService.currentPage = 0;
    this.reportsService.getMoneyShareReport({
      page: 0,
      q: term,
      useCache: false,
      showLoader: true
    });
  }

  protected onDateRangeChange() {
    const startDate = this.dateRange.value.start;
    const endDate = this.dateRange.value.end;

    // Convert dates to timestamps
    const startTimestamp = startDate ? startDate.getTime() : undefined;
    const endTimestamp = endDate ? endDate.getTime() : undefined;

    this.reportsService.startDate = startTimestamp;
    this.reportsService.endDate = endTimestamp;
    this.reportsService.currentPage = 0;

    this.reportsService.getMoneyShareReport({
      page: 0,
      startDate: startTimestamp,
      endDate: endTimestamp,
      useCache: false,
      showLoader: true
    });
  }

  protected onPageChange(event: PageEvent) {
    this.reportsService.currentPage = event.pageIndex;
    this.reportsService.currentPageSize = event.pageSize;
    this.reportsService.getMoneyShareReport({
      page: event.pageIndex,
      perPage: event.pageSize,
      useCache: false,
      showLoader: true
    });
  }

  protected clearDateFilter() {
    this.dateRange.reset();
  }

  protected get hasDateFilter(): boolean {
    return !!(this.dateRange.value.start || this.dateRange.value.end);
  }
}

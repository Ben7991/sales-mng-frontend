import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ButtonComponent } from '@shared/components/button/button.component';
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
    DecimalPipe,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatIconModule,
    MatDivider,
    ButtonComponent
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
    start: new FormControl<Date | null>(new Date()),
    end: new FormControl<Date | null>(new Date())
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

    if (startDate) {
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);
      this.reportsService.startDate = startOfDay.toISOString();
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      this.reportsService.endDate = endOfDay.toISOString();
    }

    this.reportsService.currentPage = 0;

    this.reportsService.getMoneyShareReport({
      page: 0,
      startDate: this.reportsService.startDate,
      endDate: this.reportsService.endDate,
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
    this.dateRange.setValue({
      start: new Date(),
      end: new Date()
    })
  }

  protected get hasDateFilter(): boolean {
    return !!(this.dateRange.value.start || this.dateRange.value.end);
  }
}

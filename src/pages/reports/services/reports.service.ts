import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { getMoneyShareUrl } from '@shared/constants/api.constants';
import { finalize, map } from 'rxjs';
import { MoneyShareData, MoneyShareResponse } from '../models/interface';
import { transformMoneyShareResponse } from '../helpers/reports.adapter';
import { REPORTS_PAGE_SIZE } from '../constants/reports.constant';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private readonly http = inject(HttpClient);

  public readonly moneyShareData = signal<MoneyShareData[] | null>(null);
  public readonly totalCount = signal<number>(0);
  public readonly bonus = signal<number>(0);
  public readonly isLoading = signal<boolean>(false);

  public currentPage = 0;
  public currentPageSize = REPORTS_PAGE_SIZE;
  public searchQuery = '';
  public startDate: string;
  public endDate: string;

  private cache = new Map<string, MoneyShareResponse>();

  constructor() {
    // Set default start date to midnight of current day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.startDate = today.toISOString();

    // Set default end date to last moment of current day
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    this.endDate = endOfDay.toISOString();
  }

  public getMoneyShareReport(options?: {
    page?: number;
    perPage?: number;
    q?: string;
    startDate?: string;
    endDate?: string;
    useCache?: boolean;
    showLoader?: boolean;
  }) {
    const page = options?.page ?? this.currentPage;
    const perPage = options?.perPage ?? this.currentPageSize;
    const q = options?.q ?? this.searchQuery;
    const startDate = options?.startDate ?? this.startDate;
    const endDate = options?.endDate ?? this.endDate;
    const useCache = options?.useCache ?? false;
    const showLoader = options?.showLoader ?? true;

    const cacheKey = `${page}-${perPage}-${q}-${startDate}-${endDate}`;

    if (useCache && this.cache.has(cacheKey)) {
      const cachedData = this.cache.get(cacheKey)!;
      this.moneyShareData.set(cachedData.data);
      this.totalCount.set(cachedData.count);
      this.bonus.set(cachedData.bonus);
      return;
    }

    if (showLoader) {
      this.isLoading.set(true);
    }

    this.http
      .get<MoneyShareResponse>(getMoneyShareUrl(perPage, page, q, startDate, endDate))
      .pipe(
        map(transformMoneyShareResponse),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.moneyShareData.set(response.data);
          this.totalCount.set(response.count);
          this.bonus.set(response.bonus);
          this.cache.set(cacheKey, response);
        },
        error: () => {
          this.moneyShareData.set([]);
          this.totalCount.set(0);
          this.bonus.set(0);
        }
      });
  }
}

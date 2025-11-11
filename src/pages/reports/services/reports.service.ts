import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { getMoneyShareUrl } from '@shared/constants/api.constants';
import { MoneyShareData, MoneyShareResponse } from '../models/interface';

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
  public currentPageSize = 10;
  public searchQuery = '';
  public startDate: number | undefined;
  public endDate: number | undefined;

  private cache = new Map<string, MoneyShareResponse>();

  getMoneyShareReport(options?: {
    page?: number;
    perPage?: number;
    q?: string;
    startDate?: number;
    endDate?: number;
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
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: response => {
          this.moneyShareData.set(response.data);
          this.totalCount.set(response.count);
          this.bonus.set(response.bonus);
          this.cache.set(cacheKey, response);
        },
        error: error => {
          console.error('Error fetching money share report:', error);
          this.moneyShareData.set([]);
          this.totalCount.set(0);
          this.bonus.set(0);
        }
      });
  }

  clearCache() {
    this.cache.clear();
  }
}

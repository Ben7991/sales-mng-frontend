import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {User, UserApiParams, userArrayResponse} from '@shared/models/interface';
import {CHNANGE_USER_STATUS, GET_USERS_URL, UPDATE_USER_INFO} from '@shared/constants/api.constants';
import {catchError, EMPTY, finalize, Observable, tap} from 'rxjs';
import {addUserApiResponse, addUserInterface} from '../interface';
import {UserAccountStatus} from '@shared/models/types';
import {SnackbarService} from '@shared/services/snackbar/snackbar.service';
import {TOAST_MESSAGES} from '@shared/constants/general.constants';
import {USERS_PAGE_SIZE} from '../constants/user-management.const';

const DEFAULT_USER_FETCH_OPTIONS: { useCache?: boolean, showLoader?: boolean } = {
  useCache: false,
  showLoader: true
};

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private readonly http = inject(HttpClient);
  private readonly snackbarService = inject(SnackbarService);

  public readonly users = signal<User[] | null>(null);
  public readonly isLoadingUsers = signal(false);
  public readonly usersCount = signal(0);
  public searchQuery = '';
  public currentPage = 0;
  public currentPageSize = USERS_PAGE_SIZE;

  public getUsers({ useCache, showLoader } = DEFAULT_USER_FETCH_OPTIONS): void {
    if (useCache && this.users()) {
      return;
    }

    this.isLoadingUsers.set(showLoader ?? true);

    let httpParams = new HttpParams();
    httpParams = httpParams.set('perPage', this.currentPageSize.toString());
    httpParams = httpParams.set('page', this.currentPage.toString());
    if (this.searchQuery) {
      httpParams = httpParams.set('q', this.searchQuery);
    }

    this.http.get<userArrayResponse>(GET_USERS_URL, { params: httpParams })
      .pipe(
        tap((response) => {
          this.users.set(response.data.users);
          this.usersCount.set(response.data.count);
        }),
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);
          return EMPTY;
        }),
        finalize(() => this.isLoadingUsers.set(false))
      )
      .subscribe();
  }

  public getAllUsers(params?: UserApiParams):Observable<userArrayResponse> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.perPage !== undefined) {
        httpParams = httpParams.set('perPage', params.perPage.toString());
      }
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.q !== undefined && params.q !== '') {
        httpParams = httpParams.set('q', params.q);
      }
    }

    return this.http.get<userArrayResponse>(GET_USERS_URL, { params: httpParams });
  }

  public addUser(userData: addUserInterface): Observable<addUserApiResponse> {
    return this.http.post<addUserApiResponse>(GET_USERS_URL, userData);
  }

  public addUserAndRefresh(userData: addUserInterface): void {
    this.http.post<addUserApiResponse>(GET_USERS_URL, userData)
      .subscribe({
        next: (response) => {
          this.getUsers({ showLoader: false, useCache: false });
          this.snackbarService.showSuccess(response.message || 'User added successfully');
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);
        }
      });
  }

  public updateUserInfo(userId: string,userData: Partial<addUserInterface>): Observable<addUserApiResponse>{
    const url = UPDATE_USER_INFO.replace('{id}', userId);
    return this.http.patch<addUserApiResponse>(url,userData)
  }

  public updateUserAndRefresh(userId: string, userData: Partial<addUserInterface>): void {
    const url = UPDATE_USER_INFO.replace('{id}', userId);
    this.http.patch<addUserApiResponse>(url, userData)
      .subscribe({
        next: (response) => {
          this.getUsers({ showLoader: false, useCache: false });
          this.snackbarService.showSuccess(response.message || 'User updated successfully');
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);
        }
      });
  }

  public changeUserStatus(userId: string, status: UserAccountStatus): Observable<{ message:string }> {
    const url = CHNANGE_USER_STATUS.replace('{id}', userId);
    return this.http.patch<{ message:string }>(url, { status });
  }

  public changeUserStatusAndRefresh(userId: string, status: UserAccountStatus): void {
    const url = CHNANGE_USER_STATUS.replace('{id}', userId);
    this.http.patch<{ message:string }>(url, { status })
      .subscribe({
        next: (response) => {
          this.getUsers({ showLoader: false, useCache: false });
          this.snackbarService.showSuccess(response.message || 'User status changed successfully');
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error?.message ?? TOAST_MESSAGES.HTTP_ERROR;
          this.snackbarService.showError(msg);
        }
      });
  }
}

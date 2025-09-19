import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {UserApiParams, userArrayResponse} from '@shared/models/interface';
import {CHNANGE_USER_STATUS, GET_USERS_URL, UPDATE_USER_INFO} from '@shared/constants/api.constants';
import {Observable} from 'rxjs';
import {addUserApiResponse, addUserInterface} from '../interface';
import {UserAccountStatus} from '@shared/models/types';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private http = inject(HttpClient);

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

  public updateUserInfo(userId: string,userData: Partial<addUserInterface>): Observable<addUserApiResponse>{
    const url = UPDATE_USER_INFO.replace('{id}', userId);
    return this.http.patch<addUserApiResponse>(url,userData)
  }

  public changeUserStatus(userId: string, status: UserAccountStatus): Observable<{ message:string }> {
    const url = CHNANGE_USER_STATUS.replace('{id}', userId);
    return this.http.patch<{ message:string }>(url, { status });
  }

}


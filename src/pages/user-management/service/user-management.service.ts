import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {userArrayResponse} from '@shared/models/interface';
import {GET_USERS_URL} from '@shared/constants/api.constants';
import {Observable} from 'rxjs';
import {addUserApiResponse, addUserInterface} from '../interface';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private http = inject(HttpClient);

  public getAllUsers():Observable<userArrayResponse> {
    return this.http.get<userArrayResponse>(GET_USERS_URL);
  }

  public addUser(userData: addUserInterface): Observable<addUserApiResponse> {
    return this.http.post<addUserApiResponse>(GET_USERS_URL, userData);
  }
}


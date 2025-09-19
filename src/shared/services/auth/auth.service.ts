import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {
  AUTH_FORGOT_PASSWORD_URL,
  AUTH_IN_APP_PASSWORD_CHANGE,
  AUTH_LOGIN_URL,
  AUTH_REFRESH_TOKEN_URL,
  AUTH_RESET_PASSWORD_URL,
  AUTH_USER_UPDATE,
  GET_AUTH_USER
} from '@shared/constants/api.constants';
import {Observable} from 'rxjs';
import {LoginForm, LoginResponse, PasswordResetForm} from '../../../pages/auth/models/interface';
import {LocalStorageKeys, LocalStorageService} from '../localstorage/localstorage.service';
import {PasswordChange, UserResponse} from '@shared/models/interface';
import {addUserApiResponse, addUserInterface} from '../../../pages/user-management/interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly localStorageService = inject(LocalStorageService);

  private accessToken: string | null = null;

  constructor() {
    this.accessToken =
      this.localStorageService.getLocalStorageItem(LocalStorageKeys.ACCESS_TOKEN);
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public setAccessToken(token: string): void {
    this.accessToken = token;
    this.localStorageService.setLocalStorageItem(LocalStorageKeys.ACCESS_TOKEN, token);
  }

  public login(form: LoginForm): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(AUTH_LOGIN_URL, form);
  }

  public getUserDetails():Observable<UserResponse>{
    return this.http.get<UserResponse>(GET_AUTH_USER)
  }

  public updateDetails(userData: Partial<addUserInterface>): Observable<addUserApiResponse>{
    return this.http.post<addUserApiResponse>(AUTH_USER_UPDATE,userData)
  }

  public changePassword(userData: PasswordChange) {
    return this.http.post<{ message: string }>(
      AUTH_IN_APP_PASSWORD_CHANGE,
      userData
    );
  }

  public requestPasswordResetLink(
    form: { email: string }
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(AUTH_FORGOT_PASSWORD_URL, form);
  }

  public resetPassword(
    form: PasswordResetForm,
    token: string
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${AUTH_RESET_PASSWORD_URL}?token=${token}`, form);
  }

  public refreshToken(): Observable<{ token: string }> {
    return this.http.get<{ token: string }>(AUTH_REFRESH_TOKEN_URL);
  }
}

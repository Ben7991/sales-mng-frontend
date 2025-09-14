import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTH_FORGOT_PASSWORD_URL, AUTH_LOGIN_URL, AUTH_RESET_PASSWORD_URL } from '@shared/constants/api.constants';
import { Observable } from 'rxjs';
import { LoginForm, LoginResponse, PasswordResetForm } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  public login(form: LoginForm): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(AUTH_LOGIN_URL, form);
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
}

import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthLayoutComponent} from '@shared/components/auth-layout/auth-layout.component';
import {LoginFormComponent} from '@shared/components/auth-forms/login-form/login-form.component';

@Component({
  selector: 'app-login',
  imports: [
    AuthLayoutComponent,
    LoginFormComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import {AuthLayoutComponent} from '@shared/components/auth-layout/auth-layout.component';
import {ForgotPswFormComponent} from '@shared/components/auth-forms/forgot-psw-form/forgot-psw-form.component';

@Component({
  selector: 'app-forget-password',
  imports: [
    AuthLayoutComponent,
    ForgotPswFormComponent
  ],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgetPasswordComponent {

}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import {AuthLayoutComponent} from '@shared/components/auth-layout/auth-layout.component';
import {ChangePswFormComponent} from '@shared/components/auth-forms/change-psw-form/change-psw-form.component';

@Component({
  selector: 'app-change-password',
  imports: [
    AuthLayoutComponent,
    ChangePswFormComponent
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {

}

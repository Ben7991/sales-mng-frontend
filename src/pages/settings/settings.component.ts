import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {GeneralComponent} from './components/general/general.component';
import {PasswordComponent} from './components/password/password.component';

@Component({
  selector: 'app-settings',
  imports: [
    MatTabGroup,
    MatTab,
    GeneralComponent,
    PasswordComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {

}

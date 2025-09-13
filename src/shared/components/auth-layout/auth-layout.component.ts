import {ChangeDetectionStrategy, Component, input, TemplateRef} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';

@Component({
  selector: 'app-auth-layout',
  imports: [
    MatCard,
    MatCardContent,
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLayoutComponent {
  public readonly title = input('')
  public readonly subtitle = input<string>()
  public readonly contentTemplate = input<TemplateRef<any> | undefined>(undefined);
}

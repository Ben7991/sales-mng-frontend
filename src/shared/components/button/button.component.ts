import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

type ButtonType = HTMLButtonElement['type'];
type ButtonVariant = 'filled' | 'outlined';
type IconType = 'material' | 'image'; // relative/http image, or an angular material font image

@Component({
  selector: 'app-button',
  imports: [
    NgClass,
    NgStyle,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  public readonly text = input('');
  public readonly type = input<ButtonType>('button');
  public readonly variant = input<ButtonVariant>('filled');
  public readonly disabled = input(false);
  public readonly isLoading = input(false);
  public readonly icon = input<string | undefined>(undefined);
  public readonly iconType = input<IconType>('image');
  public readonly iconLeft = input(true);
  public readonly isIconButton = input(false);
  public readonly styles = input({});
  public readonly iconStyles = input({});
}

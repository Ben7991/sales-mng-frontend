import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LoadingIndicatorSize } from '@shared/models/types';

@Component({
  selector: 'app-loader',
  imports: [NgStyle],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  public readonly size = input<LoadingIndicatorSize>('large');
  public readonly leftAlign = input(false);
  public readonly styles = input<object>();
}

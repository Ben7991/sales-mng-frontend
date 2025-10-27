import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {MatDivider} from '@angular/material/divider';
import {Router} from '@angular/router';

@Component({
  selector: 'app-metricscard',
  imports: [

  ],
  templateUrl: './metricscard.component.html',
  styleUrl: './metricscard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricscardComponent {
  private router = inject(Router);

  public readonly metricNumber = input<number>()
  public  readonly metricTitle = input<string>();
  public  readonly showActions = input<boolean>(false);
  public readonly routePath = input<string>('');
  public formattedNumber = computed(() =>
    this.metricNumber()
  );

  viewAction() {
    const path = this.routePath();
    if (path) {
      this.router.navigate([path]);
    } else {
      console.warn(`No route defined for ${this.metricTitle()}`);
    }
  }
}

import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-metricscard',
  imports: [

  ],
  templateUrl: './metricscard.component.html',
  styleUrl: './metricscard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricscardComponent {
  readonly metricNumber = input<number>()
  readonly metricTitle = input<string>();
  readonly showActions = input<boolean>(false);
  public formattedNumber = computed(() =>
    this.metricNumber()
  );

  viewAction() {
    console.log(`Navigating to view details for ${this.metricTitle()}`);
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricscardComponent } from './metricscard.component';

describe('MetricscardComponent', () => {
  let component: MetricscardComponent;
  let fixture: ComponentFixture<MetricscardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricscardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricscardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

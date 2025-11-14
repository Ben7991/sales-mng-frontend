import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DashboardService } from './service/dashboard.service';
import { MetricscardComponent } from './components/metricscard/metricscard.component';
import { DashboardSummary } from './models/interface';
import { NAVIGATION_ROUTES } from '@shared/constants/navigation.constant';
import { AuthorizationService } from '@shared/services/auth/authorization.service';
import { Page } from '@shared/models/enums';
import { DASHBOARD_FEATURES } from '@shared/constants/rbac.constants';

const colorPalette = ['#4B5563', '#93A8AC', '#D1D5DB', '#E5E7EB', '#E15759', '#76B7B2'];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MetricscardComponent, FormsModule, BaseChartDirective, MatProgressSpinner],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  dashboardService = inject(DashboardService);
  private authorizationService = inject(AuthorizationService);

  summaryData = signal<DashboardSummary | null>(null);
  protected isMetricSummaryLoading = this.dashboardService.isLoadingDashboard;
  protected isHighValueSummaryLoading = this.dashboardService.isLoadingHighValueCustomers;
  protected isOrderSummaryLoading = this.dashboardService.isLoadingOrderSummary;

  public metrics: any[] = [];

  // Permission checks
  public canViewTopCards = this.authorizationService.hasFeatureAccess(Page.DASHBOARD, DASHBOARD_FEATURES.VIEW_TOP_CARDS);
  public canViewCharts = this.authorizationService.hasFeatureAccess(Page.DASHBOARD, DASHBOARD_FEATURES.VIEW_CHARTS);
  public canViewRecentActivities = this.authorizationService.hasFeatureAccess(Page.DASHBOARD, DASHBOARD_FEATURES.VIEW_RECENT_ACTIVITIES);

  public barChartData?: ChartConfiguration<'bar'>['data'];
  public doughnutChartData?: ChartConfiguration<'doughnut'>['data'];
  public pieChartData?: ChartConfiguration<'pie'>['data'];

  public doughnutLegend: { name: string; value: string; color: string }[] = [];
  public pieLegend: { label: string; value: string; color: string }[] = [];

  public years: number[] = [];
  public selectedYear: number = new Date().getFullYear();
  public months: string[] = [];
  public selectedMonth!: string;

  constructor() {
    effect(() => {
      const summary = this.dashboardService.dashboardSummary$();
      if (summary?.data?.summary) {
        this.handleSummary(summary.data.summary);
      }
    });

    effect(() => {
      const orders = this.dashboardService.orderSummary$();
      if (orders?.data) {
        this.handleOrderSummary(orders.data);
      }
    });

    effect(() => {
      const highValueCustomers = this.dashboardService.highValueCustomers$();
      if (highValueCustomers?.data) {
        this.handleHighValueCustomers(highValueCustomers.data);
      }
    });
  }

  ngOnInit() {
    this.generateYearOptions();
    this.generateMonthOptions();

    this.dashboardService.getDashboardSummary();
    this.dashboardService.getOrderSummary(this.selectedYear.toString());
    this.dashboardService.getHighValueCustomers(this.selectedMonth);
  }

  private handleSummary(summary: DashboardSummary): void {
    this.summaryData.set(summary);

    this.metrics = [
      { metricsName: 'TOTAL CUSTOMERS', metricsNumber: summary.totalCustomers, showAction: true ,route: NAVIGATION_ROUTES.CUSTOMERS.HOME,},
      { metricsName: 'TOTAL SUPPLIERS', metricsNumber: summary.totalSuppliers, showAction: true ,route: NAVIGATION_ROUTES.SUPPLIERS.HOME,},
      { metricsName: 'TOTAL PRODUCTS', metricsNumber: summary.totalProducts, showAction: true ,route:NAVIGATION_ROUTES.INVENTORY.HOME,},
      { metricsName: 'TOTAL CATEGORIES', metricsNumber: summary.totalCategories, showAction: true ,route:NAVIGATION_ROUTES.INVENTORY.HOME,},
    ];

    const paid = summary.orders.paidPercent;
    const outstanding = summary.orders.outstandingPercent;
    const total = paid + outstanding;

    const paidPercent = total > 0 ? ((paid / total) * 100).toFixed(1) : '0';
    const outstandingPercent = total > 0 ? ((outstanding / total) * 100).toFixed(1) : '0';

    this.pieChartData = {
      labels: ['Paid', 'Outstanding'],
      datasets: [
        {
          data: [paid, outstanding],
          backgroundColor: ['#4B5563', '#93A8AC'],
          borderWidth: 0,
        },
      ],
    };

    this.pieLegend = [
      { label: 'Paid', value: `${paidPercent}%`, color: '#4B5563' },
      { label: 'Outstanding', value: `${outstandingPercent}%`, color: '#93A8AC' },
    ];

    this.cdr.markForCheck();
  }

  private handleOrderSummary(orders: any[]): void {
    const labels = orders.map((o) => o.month.substring(0, 3).toUpperCase());
    const totals = orders.map((o) => o.total);

    this.barChartData = {
      labels,
      datasets: [
        {
          data: totals,
          backgroundColor: '#93A8AC',
          borderRadius: 4,
          barThickness: 40,
        },
      ],
    };
    this.cdr.markForCheck();
  }

  private handleHighValueCustomers(customers: any[]): void {
    const data = customers.map((c) => c.percent);
    const labels = customers.map((c) => c.name);

    this.doughnutChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colorPalette.slice(0, customers.length),
          borderWidth: 0,
        },
      ],
    };

    this.doughnutLegend = customers.map((c, i) => ({
      name: c.name,
      value: `${c.percent}%`,
      color: colorPalette[i % colorPalette.length],
    }));

    this.cdr.markForCheck();
  }

  private generateYearOptions(): void {
    const currentYear = new Date().getFullYear();
    this.years = [currentYear, currentYear - 1, currentYear - 2];
  }

  onYearChange(): void {
    this.dashboardService.getOrderSummary(this.selectedYear.toString());
  }

  private generateMonthOptions(): void {
    const monthsFull = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const currentMonthIndex = new Date().getMonth();
    const availableMonths: string[] = [];

    for (let i = 0; i < 3; i++) {
      const index = (currentMonthIndex - i + 12) % 12;
      availableMonths.push(monthsFull[index]);
    }

    this.months = availableMonths.reverse();
    this.selectedMonth = this.months[this.months.length - 1];
  }

  onMonthChange(): void {
    this.dashboardService.getHighValueCustomers(this.selectedMonth);
  }

  public barChartOptions: ChartConfiguration<'bar'>['options'] = Object.freeze({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 250 },
        grid: { color: '#e5e7eb' },
      },
    },
  });

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '70%',
    plugins: { legend: { display: false } },
  };
}

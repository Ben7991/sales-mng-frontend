import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-sales-mgt',
  imports: [
    MatTab,
    MatTabGroup,
    RouterOutlet
  ],
  templateUrl: './sales-mgt.component.html',
  styleUrl: './sales-mgt.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesMgtComponent implements OnInit {
  selectedTabIndex = 0;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const childRoute = this.route.firstChild?.snapshot?.routeConfig?.path;
    this.selectedTabIndex = childRoute === 'arrears' ? 1 : 0;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const childRoute = this.route.firstChild?.snapshot?.routeConfig?.path;
        this.selectedTabIndex = childRoute === 'arrears' ? 1 : 0;
      });
  }

  onTabChange(index: number): void {
    const tab = index === 0 ? 'orders' : 'arrears';
    this.router.navigate([tab], {
      relativeTo: this.route,
      queryParamsHandling: 'merge'
    });
  }

}

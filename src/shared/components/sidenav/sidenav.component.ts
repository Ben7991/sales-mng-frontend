import {ChangeDetectionStrategy, Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SidenavService} from '@shared/components/sidenav/service/sidenav-service.service';

@Component({
  selector: 'app-sidenav',
  imports: [
    RouterModule,
    CommonModule,
    NgOptimizedImage
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent  {
  public readonly sidenavService = inject(SidenavService);
}

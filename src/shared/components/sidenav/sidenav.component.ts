import {ChangeDetectionStrategy, Component, inject, Input, OnInit, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SidenavService} from '@shared/components/sidenav/service/sidenav.service';

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
  protected hoveredItemIndex = signal<number | null>(null);
  protected hoveredItemName = signal<string>('');
  protected tooltipPosition = signal<{ top: number; left: number }>({ top: 0, left: 0 });

  onMenuItemHover(index: number, event: MouseEvent): void {
    if (!this.sidenavService.isCollapsed$()) {
      return;
    }

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    this.hoveredItemIndex.set(index);
    this.hoveredItemName.set(this.sidenavService.menuItems$()[index].name);
    this.tooltipPosition.set({
      top: rect.top + (rect.height / 2),
      left: rect.right + 12
    });
  }

  onMenuItemLeave(): void {
    this.hoveredItemIndex.set(null);
    this.hoveredItemName.set('');
  }
}

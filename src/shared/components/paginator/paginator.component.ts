import { Component, computed, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50];

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  totalItems = input.required<number>();
  pageSize = input.required<number>();
  currentPage = input<number>(0);
  pageSizeOptions = input<number[]>(DEFAULT_PAGE_SIZE_OPTIONS);
  
  pageChange = output<PageEvent>();

  /**
   * Computed signal to determine if paginator should be visible
   * Hidden only when there are no items
   */
  protected readonly isVisible = computed(() => {
    const total = this.totalItems();
    return total > 0;
  });

  /**
   * Computed signal to ensure current pageSize is included in options
   * This ensures Material paginator displays the dropdown correctly
   */
  protected readonly effectivePageSizeOptions = computed(() => {
    let options = this.pageSizeOptions();
    const currentSize = this.pageSize();
    
    // If options array is empty, use default options
    if (options.length === 0) {
      options = DEFAULT_PAGE_SIZE_OPTIONS;
    }
    
    // If current size is already in options, return as is
    if (options.includes(currentSize)) {
      return options;
    }
    
    // Otherwise, add current size and sort
    return [...options, currentSize].sort((a, b) => a - b);
  });

  protected onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}

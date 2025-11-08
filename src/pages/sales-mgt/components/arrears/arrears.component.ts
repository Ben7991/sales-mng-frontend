import {ChangeDetectionStrategy, Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SearchComponent} from '@shared/components/search/search.component';
import {TableComponent} from '@shared/components/user-management/table/table.component';
import {arrearsSearchConfig, arrearsTableColumns} from './constants/arrears.data';
import {PageEvent} from '@angular/material/paginator';
import {ArrearsService} from './services/arrears.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {ButtonComponent} from '@shared/components/button/button.component';
import {ArrearsDetailsModalComponent} from './components/arrears-details-modal/arrears-details-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {ArrearsDetailsData} from './models/types';

@Component({
  selector: 'app-arrears',
  imports: [
    SearchComponent,
    TableComponent,
    MatProgressSpinner,
    TableComponent,
    ButtonComponent
  ],
  templateUrl: './arrears.component.html',
  styleUrl: './arrears.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrearsComponent implements OnInit {
  @ViewChild('customActions', { read: TemplateRef })
  customActionsTemplate!: TemplateRef<any>;
  private dialog = inject(MatDialog)

  private readonly arrearsService = inject(ArrearsService);
  protected readonly salesSearchConfig = arrearsSearchConfig;
  protected readonly tableColumns = arrearsTableColumns;

  protected readonly customerArrears = this.arrearsService.customerArrears;
  protected readonly arrearsCount = this.arrearsService.customerArrearsCount;
  protected readonly isLoadingArrears = this.arrearsService.isLoadingArrears;

  protected readonly currentPageSize = this.arrearsService.currentPageSize;
  protected readonly currentPage = this.arrearsService.currentPage;

  ngOnInit(): void {
    this.arrearsService.getCustomerArrears();
  }


  protected onUserSearchTermChange(searchTerm: string): void {
    this.arrearsService.searchQuery = searchTerm;
    this.arrearsService.currentPage = 0;
    this.arrearsService.getCustomerArrears();
  }

  protected onPageChange(event: PageEvent): void {
    this.arrearsService.currentPageSize = event.pageSize;
    this.arrearsService.currentPage = event.pageIndex;
    this.arrearsService.getCustomerArrears({ showLoader: false, useCache: false });
  }

  viewDetails(customer: any): void {
    this.arrearsService.getArrearDetails(customer.customerId).subscribe({
      next: (response) => {
        const dialogRef = this.dialog.open(ArrearsDetailsModalComponent, {
          width: '900px',
          maxWidth: '95vw',
          data: {
            customerName: customer.customerName,
            customerId: customer.customerId,
            orders: response.data
          } as ArrearsDetailsData
        });

      },
      error: (err) => {
        console.error('Failed to load arrear details:', err);
      }
    });
  }

}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ButtonComponent } from "@shared/components/button/button.component";
import { getOrderUrl, getPrintSalesReceiptUrl } from '@shared/constants/api.constants';
import { ReportDownloadService } from '@shared/services/report-download/report-download.service';
import { SnackbarService } from '@shared/services/snackbar/snackbar.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-order-details-canvas',
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressSpinner,
        MatDivider,
        MatMenuModule,
        ButtonComponent
    ],
    templateUrl: './order-details-canvas.component.html',
    styleUrl: './order-details-canvas.component.scss'
})
export class OrderDetailsCanvasComponent {
    private readonly http = inject(HttpClient);
    private readonly snackbar = inject(SnackbarService);
    private readonly reportDownloadService = inject(ReportDownloadService);

    @Input() set orderId(v: number | null) {
        this._orderId = v ?? null;
        this.fetchOrder();
    }
    @Input() openUpdatePaymentModal!: (orderId: number) => void;

    @Output() canvasClose = new EventEmitter<void>();

    private _orderId: number | null = null;
    protected readonly loading = signal(false);
    protected readonly order = signal<any>(null);
    protected readonly loadingError = signal(false);
    protected readonly isDownloading = signal(false);

    protected fetchOrder() {
        if (!this._orderId) return;

        this.loadingError.set(false);
        this.loading.set(true);
        this.http.get<any>(getOrderUrl(this._orderId))
            .pipe(
                finalize(() => this.loading.set(false))
            )
            .subscribe({
                next: (res) => {
                    this.order.set(res.data);
                },
                error: () => {
                    this.loadingError.set(true);
                }
            });
    }

    protected getTotalPaidPercent() {
        const order = this.order();
        if (!order) return 0;
        const paid = order.amountPaid || 0;
        const total = order.orderItems?.reduce((sum: number, item: any) => sum + (item.amount || 0), 0) || 0;
        if (total === 0) return 0;
        return Math.min(100, Math.round((paid / total) * 100));
    }

    protected getBalance() {
        const order = this.order();
        if (!order) return 0;
        const paid = order.amountPaid || 0;
        const total = this.getTotal();
        return Math.max(0, total - paid);
    }

    protected getTotal(): number {
        const order = this.order();
        if (!order) return 0;
        return order.orderItems?.reduce((sum: number, item: any) => sum + (item.amount || 0), 0) || 0;
    }

    protected onUpdatePayment() {
        if (this.openUpdatePaymentModal && this._orderId != null) {
            this.openUpdatePaymentModal(this._orderId);
        }
    }

    protected exportReceipt(): void {
        const orderId = this._orderId;
        if (!orderId) return;

        this.isDownloading.set(true);
        this.http.get<any>(getPrintSalesReceiptUrl(orderId))
            .pipe(finalize(() => this.isDownloading.set(false)))
            .subscribe({
                next: (reportData) => {
                    try {
                        const filename = `receipt-${orderId}-${new Date().getTime()}.pdf`;
                        this.reportDownloadService.downloadPDF(reportData, filename);
                        this.snackbar.showSuccess('Receipt downloaded successfully');

                        this.reportDownloadService.downloadPDF(reportData);
                    } catch (error) {
                        console.error('Error generating PDF:', error);
                        this.snackbar.showError('Failed to generate PDF');
                    }
                },
                error: (error) => {
                    console.error('Error fetching receipt:', error);
                    this.snackbar.showError('Failed to download receipt');
                }
            });
    }

    protected printReceipt(): void {
        const orderId = this._orderId;
        if (!orderId) return;

        
    }

    protected onCloseCanvas(): void {
        this.canvasClose.emit();
    }
}

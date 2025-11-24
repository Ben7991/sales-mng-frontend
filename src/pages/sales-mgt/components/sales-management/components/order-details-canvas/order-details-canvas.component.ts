import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ButtonComponent } from "@shared/components/button/button.component";
import { STATUS_COLORS } from '@shared/constants/colors.constant';
import {SalesService} from '../../service/sales.service';

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
    protected readonly salesService = inject(SalesService);

    protected readonly statusColors = STATUS_COLORS;

    @Input() set orderId(v: number | null) {
        this._orderId = v ?? null;
        this.fetchSingleOrder();
    }
    @Input() openUpdatePaymentModal!: (orderId: number) => void;

    @Output() canvasClose = new EventEmitter<void>();

    private _orderId: number | null = null;
    protected readonly isDownloading = signal(false);

    protected fetchSingleOrder(): void {
        if (!this._orderId) return;

        this.salesService.getSingleOrder(this._orderId).subscribe();
    }

    protected getTotalPaidPercent(): number {
        const order = this.salesService.singleOrder();
        if (!order) return 0;

        const paid = order.amountPaid || 0;
        const total = order.orderItems?.reduce((sum: number, item: any) => sum + (item.amount || 0), 0) || 0;

        if (total === 0) return 0;

        return Math.min(100, Math.round((paid / total) * 100));
    }

    protected getBalance(): number {
        const order = this.salesService.singleOrder();
        if (!order) return 0;

        const paid = order.amountPaid || 0;
        const total = this.getTotal();

        return Math.max(0, total - paid);
    }

    protected getTotal(): number {
        const order = this.salesService.singleOrder();
        if (!order) return 0;

        return order.orderItems?.reduce((sum: number, item: any) => sum + (item.amount || 0), 0) || 0;
    }

    protected onUpdatePayment(): void {
        if (this.openUpdatePaymentModal && this._orderId != null) {
            this.openUpdatePaymentModal(this._orderId);
        }
    }

    protected shouldShowUpdatePaymentButton(): boolean {
        const order = this.salesService.singleOrder();
        if (!order) return false;

        const status = order.orderStatus?.toUpperCase();
        return status !== 'OPEN';
    }

    protected downloadReceipt(): void {
        const orderId = this._orderId;
        if (!orderId) return;

        this.salesService.downloadOrPrintReceipt(orderId, 'download').subscribe();
    }

    protected printReceipt(): void {
        const orderId = this._orderId;
        if (!orderId) return;

        this.salesService.downloadOrPrintReceipt(orderId, 'print').subscribe();
    }

    protected onCloseCanvas(): void {
        this.canvasClose.emit();
    }
}

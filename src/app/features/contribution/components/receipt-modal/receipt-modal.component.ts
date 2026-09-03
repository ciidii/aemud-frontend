import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule, DatePipe, DecimalPipe} from '@angular/common';
import {PaymentReceiptDto} from '../../models/finance.model';

@Component({
  selector: 'app-receipt-modal',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe],
  templateUrl: './receipt-modal.component.html',
  styleUrls: ['./receipt-modal.component.scss']
})
export class ReceiptModalComponent {
  @Input() receipt: PaymentReceiptDto | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  printReceipt(): void {
    window.print();
  }

  getMethodBadgeClass(method: string): string {
    switch (method?.toUpperCase()) {
      case 'WAVE_MONEY':
      case 'WAVE':
        return 'badge-wave';
      case 'ORANGE_MONEY':
      case 'OM':
        return 'badge-orange';
      default:
        return 'badge-cash';
    }
  }

  getMethodLabel(method: string): string {
    switch (method?.toUpperCase()) {
      case 'WAVE_MONEY':
      case 'WAVE':
        return 'Wave Mobile Money';
      case 'ORANGE_MONEY':
      case 'OM':
        return 'Orange Money';
      default:
        return 'Espèces (Cash)';
    }
  }
}

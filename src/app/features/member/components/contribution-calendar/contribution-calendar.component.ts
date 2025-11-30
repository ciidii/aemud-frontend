import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule, CurrencyPipe, NgClass} from '@angular/common';
import {ContributionMonth, ContributionYear} from "../../../../core/models/contribution-data.model";

@Component({
  selector: 'app-contribution-calendar',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgClass],
  templateUrl: './contribution-calendar.component.html',
  styleUrls: ['./contribution-calendar.component.scss']
})
export class ContributionCalendarComponent {
  @Input() calendar: ContributionYear[] = [];
  @Input() selectedMonths: ContributionMonth[] = [];
  @Output() monthClicked = new EventEmitter<ContributionMonth>();

  legend = [
    {status: 'paid', text: 'Payé'},
    {status: 'delayed', text: 'En retard'},
    {status: 'partially-paid', text: 'Paiement partiel'},
    {status: 'pending', text: 'À venir'},
    {status: 'not-applicable', text: 'Non applicable'}
  ];

  private monthNames = ['Janv', 'Févr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

  onMonthClick(month: ContributionMonth): void {
    if (month.status !== 'PAID' && month.status !== 'NOT_APPLICABLE') {
      this.monthClicked.emit(month);
    }
  }

  getMonthName(month: [number, number]): string {
    return this.monthNames[month[1] - 1];
  }

  getStatusClass(month: ContributionMonth): string {
    switch (month.status) {
      case 'PAID':
        return 'paid';
      case 'DELAYED':
        return 'delayed';
      case 'PARTIALLY_PAID':
        return 'partially-paid';
      case 'PENDING':
        return 'pending';
      case 'NOT_APPLICABLE':
        return 'not-applicable';
      default:
        return '';
    }
  }

  isSelected(month: ContributionMonth): boolean {
    return this.selectedMonths.some(m => m.idContribution === month.idContribution);
  }

  getStatusText(status: ContributionMonth['status']): string {
    switch (status) {
      case 'PAID':
        return 'Payé';
      case 'DELAYED':
        return 'En retard';
      case 'PARTIALLY_PAID':
        return 'Paiement partiel';
      case 'PENDING':
        return 'À venir';
      case 'NOT_APPLICABLE':
        return 'Non applicable';
      default:
        return '';
    }
  }
}

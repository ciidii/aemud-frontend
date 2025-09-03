import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForOf, NgIf, NgClass } from '@angular/common';

export interface Notification {
  id: string;
  icon: string;
  text: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-notification-popover',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './notification-popover.component.html',
  styleUrl: './notification-popover.component.scss'
})
export class NotificationPopoverComponent {
  @Input() notifications: Notification[] = [
    // Placeholder Data
    { id: '1', icon: 'bi-person-plus-fill', text: "Un nouveau membre 'Jean Dupont' vient de s'inscrire.", time: 'il y a 5 minutes', read: false },
    { id: '2', icon: 'bi-credit-card-fill', text: "Le paiement de Marie Martin a été confirmé.", time: 'il y a 1 heure', read: false },
    { id: '3', icon: 'bi-calendar-event', text: "Rappel : L'Assemblée Générale est demain.", time: 'hier à 18:00', read: true },
    { id: '4', icon: 'bi-file-earmark-arrow-down', text: "Votre export de la liste des membres est prêt.", time: 'hier à 12:30', read: true },
  ];
  @Output() markAllAsRead = new EventEmitter<void>();
  @Output() viewAll = new EventEmitter<void>();

  // To test the empty state, uncomment the line below and comment out the one above
  // @Input() notifications: Notification[] = [];
}
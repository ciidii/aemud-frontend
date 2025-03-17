import {Component, ViewChild} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {SendSmsComponent} from "../send-sms/send-sms.component";
import {ScheduleSmsComponent} from "../schedule-sms/schedule-sms.component";

interface SMS {
  id?: number;
  recipient: string;
  message: string;
  date?: Date;
  scheduleDate?: Date;
  status: 'Envoyé' | 'Programmé' | 'Échoué';
}

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    NgIf,
    NgForOf,
    SendSmsComponent,
    ScheduleSmsComponent
  ],
  styleUrls: ['./sms.component.css']
})
export class SmsComponent {
  smsList: SMS[] = [
    {
      id: 1,
      recipient: '+33 6 12 34 56 78',
      message: 'Bonjour, ceci est un rappel pour votre cotisation mensuelle.',
      date: new Date('2023-10-01T10:30:00'),
      status: 'Envoyé'
    },
    {
      id: 2,
      recipient: '+33 6 98 76 54 32',
      message: 'Votre réinscription est en attente. Merci de finaliser le processus.',
      date: new Date('2023-10-02T14:15:00'),
      status: 'Envoyé'
    },
    {
      id: 3,
      recipient: '+33 6 55 44 33 22',
      message: 'Notification générale pour tous les membres de l\'association.',
      scheduleDate: new Date('2023-10-05T09:00:00'),
      status: 'Programmé'
    },
    {
      id: 4,
      recipient: '+33 6 11 22 33 44',
      message: 'Rappel de cotisation pour les membres en retard.',
      date: new Date('2023-09-28T16:45:00'),
      status: 'Échoué'
    },
    {
      id: 4,
      recipient: '+33 6 11 22 33 44',
      message: 'Rappel de cotisation pour les membres en retard.',
      date: new Date('2023-09-28T16:45:00'),
      status: 'Échoué'
    },
    {
      id: 4,
      recipient: '+33 6 11 22 33 44',
      message: 'Rappel de cotisation pour les membres en retard.',
      date: new Date('2023-09-28T16:45:00'),
      status: 'Échoué'
    },
    {
      id: 4,
      recipient: '+33 6 11 22 33 44',
      message: 'Rappel de cotisation pour les membres en retard.',
      date: new Date('2023-09-28T16:45:00'),
      status: 'Échoué'
    },
    {
      id: 4,
      recipient: '+33 6 11 22 33 44',
      message: 'Rappel de cotisation pour les membres en retard.',
      date: new Date('2023-09-28T16:45:00'),
      status: 'Échoué'
    },
    {
      id: 4,
      recipient: '+33 6 11 22 33 44',
      message: 'Rappel de cotisation pour les membres en retard.',
      date: new Date('2023-09-28T16:45:00'),
      status: 'Échoué'
    },
    {
      id: 4,
      recipient: '+33 6 11 22 33 44',
      message: 'Rappel de cotisation pour les membres en retard.',
      date: new Date('2023-09-28T16:45:00'),
      status: 'Échoué'
    },
  ];

  // Simulation du solde des SMS
  smsBalance: number = 150; // Exemple de solde

  // Pagination
  currentPage: number = 1; // Page actuelle
  itemsPerPage: number = 5; // Nombre d'éléments par page

  @ViewChild(SendSmsComponent) sendSmsModal?: SendSmsComponent;
  @ViewChild(ScheduleSmsComponent) scheduleSmsModal?: ScheduleSmsComponent;

  openSendModal() {
    this.sendSmsModal?.openSendSmsModal();
  }

  openScheduleModal() {
    this.scheduleSmsModal?.openModal();
  }


  cancelSms(id: number | undefined) {
    const sms = this.smsList.find(sms => sms.id === id);
    if (sms && sms.status === 'Programmé') {
      this.smsBalance++; // Réincrémente le solde si le SMS programmé est annulé
    }
    this.smsList = this.smsList.filter(sms => sms.id !== id);
    alert('SMS annulé !');
  }

  // Méthode pour recharger le solde des SMS
  rechargeBalance() {
    const rechargeAmount = 100; // Montant de recharge simulé
    this.smsBalance += rechargeAmount;
    alert(`Votre solde a été rechargé de ${rechargeAmount} SMS. Nouveau solde : ${this.smsBalance}`);
  }

  // Méthode pour supprimer une ligne de l'historique
  deleteSms(id: number | undefined, event: MouseEvent) {
    event.preventDefault(); // Empêche l'affichage du menu contextuel par défaut
    if (confirm('Êtes-vous sûr de vouloir supprimer cet SMS de l\'historique ?')) {
      this.smsList = this.smsList.filter(sms => sms.id !== id);
      alert('SMS supprimé de l\'historique !');
    }
  }

  // Méthode pour obtenir la liste paginée des SMS
  get paginatedSmsList(): SMS[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.smsList.slice(startIndex, endIndex);
  }

  // Méthode pour changer de page
  changePage(page: number) {
    this.currentPage = page;
  }

  // Méthode pour obtenir le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.smsList.length / this.itemsPerPage);
  }

  // Méthode pour générer un tableau de numéros de page
  totalPagesArray(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }
}

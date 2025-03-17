import {Component, signal} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";

interface SMS {
  recipient: string;
  message: string;
}

interface MessageTemplate {
  name: string;
  content: string;
}

@Component({
  selector: 'app-send-sms',
  templateUrl: './send-sms.component.html',
  standalone: true,
  imports: [FormsModule, NgClass, NgForOf, NgIf],
  styleUrls: ['./send-sms.component.css']
})
export class SendSmsComponent {
  sms: SMS = {recipient: '', message: ''};
  modalIsOpened = signal(false);

  // Listes de destinataires préenregistrées
  recipientLists: string[] = [
    "Tous les membres",
    "Membres n’ayant pas cotisé",
    "Rappel de cotisation",
    "Membres en retard de réinscription",
    "Nouvelle liste 1",
    "Nouvelle liste 2",
    "Nouvelle liste 3"
  ];
  selectedList: string | null = null;
  showMoreRecipients = signal(false);
  recipientSearchTerm = signal(''); // Terme de recherche pour les destinataires

  // Templates de messages
  messageTemplates: MessageTemplate[] = [
    {
      name: "Rappel de cotisation",
      content: "Bonjour, ceci est un rappel pour votre cotisation mensuelle. Merci de régulariser votre situation."
    },
    {
      name: "Réinscription",
      content: "Bonjour, votre réinscription est en attente. Merci de finaliser le processus dès que possible."
    },
    {
      name: "Notification générale",
      content: "Bonjour, voici une annonce importante pour tous les membres de l'association."
    },
    {name: "Nouveau modèle 1", content: "Bonjour, ceci est un nouveau modèle de message."},
    {name: "Nouveau modèle 2", content: "Bonjour, ceci est un autre modèle de message."}
  ];
  selectedTemplate: MessageTemplate | null = null;
  showMoreTemplates = signal(false);
  templateSearchTerm = signal(''); // Terme de recherche pour les modèles de messages

  openSendSmsModal() {
    this.modalIsOpened.set(true);
  }

  close() {
    this.modalIsOpened.set(false);
  }

  sendSms() {
    if (!this.sms.message) {
      alert("Veuillez saisir un message.");
      return;
    }
    alert("SMS envoyé avec succès !");
  }

  // Sélection ou désélection d'une liste
  selectList(list: string) {
    if (this.selectedList === list) {
      this.selectedList = null; // Désélectionner
    } else {
      this.selectedList = list; // Sélectionner
    }
  }

  // Sélection ou désélection d'un template
  selectTemplate(template: MessageTemplate) {
    if (this.selectedTemplate === template) {
      this.selectedTemplate = null; // Désélectionner
      this.sms.message = ''; // Effacer le message
    } else {
      this.selectedTemplate = template; // Sélectionner
      this.sms.message = template.content; // Remplir le message
    }
  }

  // Basculer l'affichage des listes supplémentaires
  toggleShowMoreRecipients() {
    this.showMoreRecipients.set(!this.showMoreRecipients());
  }

  // Basculer l'affichage des templates supplémentaires
  toggleShowMoreTemplates() {
    this.showMoreTemplates.set(!this.showMoreTemplates());
  }

  // Filtrer les destinataires en fonction du terme de recherche
  get filteredRecipientLists(): string[] {
    return this.recipientLists.filter(list =>
      list.toLowerCase().includes(this.recipientSearchTerm().toLowerCase())
    );
  }

  // Filtrer les modèles de messages en fonction du terme de recherche
  get filteredMessageTemplates(): MessageTemplate[] {
    return this.messageTemplates.filter(template =>
      template.name.toLowerCase().includes(this.templateSearchTerm().toLowerCase())
    );
  }
}

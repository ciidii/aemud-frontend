import { Component, EventEmitter, Output } from '@angular/core';
import { NgForOf } from '@angular/common';

export interface MessageTemplate {
  name: string;
  content: string;
}

@Component({
  selector: 'app-template-select-modal',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './template-select-modal.component.html',
  styleUrl: './template-select-modal.component.scss'
})
export class TemplateSelectModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() templateSelected = new EventEmitter<MessageTemplate>();

  // Placeholder data for templates
  templates: MessageTemplate[] = [
    {
      name: 'Rappel de Cotisation Annuelle',
      content: 'Cher membre, nous vous rappelons que votre cotisation annuelle arrive à échéance. Veuillez la renouveler pour continuer à bénéficier des avantages.'
    },
    {
      name: 'Invitation à l\'Assemblée Générale',
      content: 'Vous êtes cordialement invité à notre Assemblée Générale qui se tiendra le [DATE] à [HEURE] au [LIEU]. Votre présence est importante.'
    },
    {
      name: 'Confirmation de Paiement',
      content: 'Bonjour, nous vous confirmons la bonne réception de votre paiement. Merci pour votre soutien.'
    },
    {
      name: 'Rappel de Cotisation Annuelle',
      content: 'Cher membre, nous vous rappelons que votre cotisation annuelle arrive à échéance. Veuillez la renouveler pour continuer à bénéficier des avantages.'
    },
    {
      name: 'Invitation à l\'Assemblée Générale',
      content: 'Vous êtes cordialement invité à notre Assemblée Générale qui se tiendra le [DATE] à [HEURE] au [LIEU]. Votre présence est importante.'
    },
    {
      name: 'Confirmation de Paiement',
      content: 'Bonjour, nous vous confirmons la bonne réception de votre paiement. Merci pour votre soutien.'
    },{
      name: 'Rappel de Cotisation Annuelle',
      content: 'Cher membre, nous vous rappelons que votre cotisation annuelle arrive à échéance. Veuillez la renouveler pour continuer à bénéficier des avantages.'
    },
    {
      name: 'Invitation à l\'Assemblée Générale',
      content: 'Vous êtes cordialement invité à notre Assemblée Générale qui se tiendra le [DATE] à [HEURE] au [LIEU]. Votre présence est importante.'
    },
    {
      name: 'Confirmation de Paiement',
      content: 'Bonjour, nous vous confirmons la bonne réception de votre paiement. Merci pour votre soutien.'
    },{
      name: 'Rappel de Cotisation Annuelle',
      content: 'Cher membre, nous vous rappelons que votre cotisation annuelle arrive à échéance. Veuillez la renouveler pour continuer à bénéficier des avantages.'
    },
    {
      name: 'Invitation à l\'Assemblée Générale',
      content: 'Vous êtes cordialement invité à notre Assemblée Générale qui se tiendra le [DATE] à [HEURE] au [LIEU]. Votre présence est importante.'
    },
    {
      name: 'Confirmation de Paiement',
      content: 'Bonjour, nous vous confirmons la bonne réception de votre paiement. Merci pour votre soutien.'
    }
  ];

  selectTemplate(template: MessageTemplate): void {
    this.templateSelected.emit(template);
  }
}

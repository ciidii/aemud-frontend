import {Component, EventEmitter, Input, Output, signal, ViewChild} from '@angular/core';
import {NgIf, NgStyle} from '@angular/common';
import {ToastrService} from "ngx-toastr";
import {MessageTemplate} from "../../../core/models/message.template";
import {TemplateService} from "../../core/template.service";
import {SmsTamplateStateService} from "../../../core/services/sms-tamplate-state.service";
import {PopupAddTemplateSms} from "../popup-add-template-sms/popup-add-template-sms";

@Component({
  selector: 'app-sms-model-option-dialog',
  standalone: true,
  templateUrl: './sms-model-option-dialog.component.html',
  styleUrls: ['./sms-model-option-dialog.component.css'],
  imports: [NgIf, NgStyle]
})
export class SmsModelOptionDialogComponent {
  isVisible = signal(false);

  @Input() x = 0;
  @Input() y = 0;
  // Outputs for actions
  @Output() modifyClicked = new EventEmitter<MessageTemplate>();
  @Output() deleteClicked = new EventEmitter<MessageTemplate>();
  @Output() closed = new EventEmitter<void>(); // Emits when the menu is closed
  @Output() onOpenAddModel = new EventEmitter<void>();
  @ViewChild(PopupAddTemplateSms) popupAddTemplateSms?: PopupAddTemplateSms;


  constructor(private toaster: ToastrService, private templateService: TemplateService, private smsTemplateState: SmsTamplateStateService) {
  }

  // Method to open the context menu
  open(): void {
    this.isVisible.set(true);
    // Optional: Add a slight delay for positioning if render takes time
    // setTimeout(() => this.adjustPosition(), 0);
    this.adjustPosition(); // Adjust position immediately on open
  }

  // Method to close the context menu
  close(): void {
    if (this.isVisible()) { // Only emit if it was actually open
      this.isVisible.set(false);
      this.closed.emit();
    }
  }


  modifyTemplate(): void {// Nous sommes en mode modification, stocker le template
    this.onOpenAddModel.emit();

    if (this.popupAddTemplateSms) {
      // Configure le modal pour la modification
      this.popupAddTemplateSms.modalTitle = 'Modifier le modèle SMS';
      this.popupAddTemplateSms.nameLabel = 'Nom du modèle';
      this.popupAddTemplateSms.namePlaceholder = 'Nom du modèle';
      this.popupAddTemplateSms.messageLabel = 'Contenu du message';
      this.popupAddTemplateSms.messagePlaceholder = 'Modifier le texte du message du modèle ici.';
      this.popupAddTemplateSms.actionButtonText = 'Mettre à jour le modèle';
      this.popupAddTemplateSms.requireName = true;
      this.popupAddTemplateSms.requireContent = true;
      this.popupAddTemplateSms.minLengthContent = 10;

      this.popupAddTemplateSms.openModal(this.smsTemplateState.selectedTemplate?.modelName, this.smsTemplateState.selectedTemplate?.smsModel); // Pré-remplir le modal
    }
    this.close()
  }

  // Handle delete button click
  onDeleteClick(): void {
    if (this.smsTemplateState.selectedTemplate){
      this.deleteTemplate(this.smsTemplateState.selectedTemplate);
    }
  }

  // Adjusts the position to keep the menu within viewport boundaries
  private adjustPosition(): void {
    if (typeof window === 'undefined' || !this.isVisible()) {
      return; // Only adjust if in browser and visible
    }


    const menuElement = document.querySelector('.context-menu') as HTMLElement;
    let menuWidth = menuElement ? menuElement.offsetWidth : 150;
    let menuHeight = menuElement ? menuElement.offsetHeight : 80;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = this.x;
    let adjustedY = this.y;

    // Check if menu goes off right edge
    if (adjustedX + menuWidth > viewportWidth) {
      adjustedX = viewportWidth - menuWidth - 10;
      if (adjustedX < 0) adjustedX = 10;
    }

    // Check if menu goes off bottom edge
    if (adjustedY + menuHeight > viewportHeight) {
      adjustedY = viewportHeight - menuHeight - 10;
      if (adjustedY < 0) adjustedY = 10;
    }


    this.x = adjustedX;
    this.y = adjustedY;
  }


  deleteTemplate(templateToDelete: MessageTemplate ): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le modèle "${templateToDelete.modelName}" ?`)) {
      this.templateService.deleteTemplate(templateToDelete.id)
        .subscribe({
          next: () => {
            // Supprimer le template de la liste locale
            this.smsTemplateState.messageTemplatesList = this.smsTemplateState.messageTemplatesList.filter(t => t.id !== templateToDelete.id);
            // Si le modèle supprimé était sélectionné, désélectionnez-le et videz le message
            if (this.smsTemplateState.selectedTemplate?.id === templateToDelete.id) {
              this.smsTemplateState.selectedTemplate = null
              // this.sms.message = '';
            }
            this.toaster.success("Réussi ")
          },
          error:err => {
            this.toaster.error(`{Une erreur s'est produit`)
          }
        });
    }
    this.close();
  }
}

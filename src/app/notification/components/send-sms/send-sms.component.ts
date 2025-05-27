import {Component, HostListener, OnInit, signal, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {SmsModelOptionDialogComponent} from "../sms-model-option-dialog/sms-model-option-dialog.component";
import {ContextMenuTriggerDirective} from "../../../shared/directives/context-menu.directive";
import {PopupAddTemplateSms} from "../popup-add-template-sms/popup-add-template-sms";
import {finalize, Observable, Subject, takeUntil} from "rxjs";
import {TemplateService} from "../../core/template.service";
import {MessageTemplate} from "../../../core/models/message.template";
import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {SmsTamplateStateService} from "../../../core/services/sms-tamplate-state.service";
import {SmsModel} from "../../../core/models/sms.model";

@Component({
  selector: 'app-send-sms',
  templateUrl: './send-sms.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgForOf,
    NgIf,
    SmsModelOptionDialogComponent,
    ContextMenuTriggerDirective,
    PopupAddTemplateSms,
    JsonPipe
  ],
  styleUrls: ['./send-sms.component.scss']
})
export class SendSmsComponent implements OnInit {

  constructor(private templateService: TemplateService,
              protected smsTemplateState: SmsTamplateStateService,
  ) {
  }

  modalIsOpened = signal(false);
  @ViewChild('optionDialogComponentRef') optionDialogRef?: SmsModelOptionDialogComponent;
  @ViewChild(PopupAddTemplateSms) popupAddTemplateSms?: PopupAddTemplateSms;
  // Context menu position and data
  contextMenuX = signal(0);
  contextMenuY = signal(0);
  selectedTemplateForPopup = signal<MessageTemplate | null>(null);

  sms: SmsModel = {message:"",recipientNumbers:[]}


  recipientLists: string[] = [
    "Tous les membres",
    "Membres n'ayant pas cotisé",
    "Rappel de cotisation",
    "Membres en retard de réinscription",
    "Nouvelle liste 1",
    "Nouvelle liste 2",
    "Nouvelle liste 3"
  ];
  selectedList: string | null = null;
  showMoreRecipients = signal(false);
  recipientSearchTerm = signal('');

  messageTemplates$!: Observable<ResponseEntityApi<MessageTemplate[]>>
  isLoadingTemplates = signal(true);
  private destroy$ = new Subject<void>();


  showMoreTemplates = signal(false);
  templateSearchTerm = signal('');

  ngOnInit(): void {
    this.loadMessageTemplates();
  }

  get filteredMessageTemplates(): MessageTemplate[] {
    return this.smsTemplateState.messageTemplatesList.filter(template =>
      template.modelName.toLowerCase().includes(this.templateSearchTerm().toLowerCase())
    );
  }


  /*
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete(); // Nettoie le Subject pour éviter les fuites de mémoire
  }

   */

  // HostListener to close the context menu when clicking anywhere on the document
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Only close if the click is outside the context menu and the context menu is open
    if (this.optionDialogRef?.isVisible()) {
      const target = event.target as HTMLElement;
      // Check if the click target is outside the context menu element itself
      if (!target.closest('.context-menu')) {
        this.closeContextMenu();
      }
    }
  }

  // HostListener to close the context menu when right-clicking anywhere on the document,
  // unless it's on a card that triggers a new context menu.
  @HostListener('document:contextmenu', ['$event'])
  onDocumentRightClick(event: MouseEvent) {
    // If context menu is open, and the right-click is NOT on a card
    if (this.optionDialogRef?.isVisible()) {
      const target = event.target as HTMLElement;
      if (!target.closest('.card[appContextMenuTrigger]')) { // Check if it's NOT a right-click on a context menu trigger card
        this.closeContextMenu();
      }
    }
  }


  openSendSmsModal() {
    this.modalIsOpened.set(true);
  }

  close() {
    this.modalIsOpened.set(false);
    this.closeContextMenu(); // Ensure context menu is closed when main modal closes
    this.popupAddTemplateSms?.closeModal()
  }

  /*
  sendSms() {
    if (!this.sms.smsModel) {
      alert("Veuillez saisir un message.");
      return;
    }
    console.log("SMS to send:", this.sms);
    alert("SMS envoyé avec succès !");
    this.close();
  }

   */

  selectList(list: string) {
    this.selectedList = this.selectedList === list ? null : list;
    this.closeContextMenu();
  }

  selectTemplateAndFillMessage(template: MessageTemplate | null): void {
    this.smsTemplateState.selectedTemplate = this.smsTemplateState.selectedTemplate === template ? null : template;
    //this.sms.smsModel = this.smsTemplateState.selectedTemplate ? template?.id : '';
    this.sms.message = template!.smsModel;

    this.closeContextMenu();
  }

  toggleShowMoreRecipients() {
    this.showMoreRecipients.set(!this.showMoreRecipients());
    this.closeContextMenu();
  }

  toggleShowMoreTemplates() {
    this.showMoreTemplates.set(!this.showMoreTemplates());
    this.closeContextMenu();
  }

  get filteredRecipientLists(): string[] {
    return this.recipientLists.filter(list =>
      list.toLowerCase().includes(this.recipientSearchTerm().toLowerCase())
    );
  }

  addTemplate(): void { // Renommée pour être plus explicite dans le template
    if (this.popupAddTemplateSms) {
      this.popupAddTemplateSms.modalTitle = 'Ajouter un nouveau modèle SMS';
      this.popupAddTemplateSms.nameLabel = 'Nom du modèle';
      this.popupAddTemplateSms.namePlaceholder = 'Ex: Rappel Cotisation';
      this.popupAddTemplateSms.messageLabel = 'Contenu du message';
      this.popupAddTemplateSms.messagePlaceholder = 'Entrez le texte complet du message du modèle ici.';
      this.popupAddTemplateSms.actionButtonText = 'Ajouter le modèle';
      this.popupAddTemplateSms.requireName = true;
      this.popupAddTemplateSms.requireContent = true;
      this.popupAddTemplateSms.minLengthContent = 10;

      this.popupAddTemplateSms.openModal('', ''); // Ouvrir le modal vide
    }
  }

  // Method called by the ContextMenuTriggerDirective
  onTemplateContextMenu(eventData: { event: MouseEvent, data: MessageTemplate }): void {
    const {event, data: template} = eventData;

    // If the same context menu is already open for this template, close it
    if (this.optionDialogRef?.isVisible() && this.selectedTemplateForPopup() === template) {
      this.closeContextMenu();
      return;
    }

    this.closeContextMenu(); // Close any currently open context menu

    this.selectedTemplateForPopup.set(template);
    this.contextMenuX.set(event.clientX);
    this.contextMenuY.set(event.clientY);
    this.smsTemplateState.selectedTemplate = template;
    // Open the context menu component via its ViewChild reference
    if (this.optionDialogRef) {
      this.optionDialogRef.open();
    }
  }

  // Centralized method to close the context menu
  closeContextMenu(): void {
    if (this.optionDialogRef?.isVisible()) {
      this.optionDialogRef.close();
      this.selectedTemplateForPopup.set(null); // Clear selected template for popup
    }
  }

  loadMessageTemplates(): void {
    this.isLoadingTemplates.set(true); // Active l'indicateur de chargement
    this.messageTemplates$ = this.templateService.getTemplates().pipe(
      finalize(() => this.isLoadingTemplates.set(false)),
      takeUntil(this.destroy$)
    );

    this.messageTemplates$?.subscribe({
      next: response => {
        if (response.status == "OK") {
          this.smsTemplateState.messageTemplatesList = response.data
        }
      },
      error: () => {
      },
      complete: () => {
      },
    });
  }
}

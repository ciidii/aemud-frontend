import {Component, HostListener, OnInit, signal, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {SmsModelOptionDialogComponent} from "../sms-model-option-dialog/sms-model-option-dialog.component";
import {ContextMenuTriggerDirective} from "../../../shared/directives/context-menu.directive";
import {PopupAddTemplateSms} from "../popup-add-template-sms/popup-add-template-sms";
import {finalize, Observable, Subject, takeUntil} from "rxjs";
import {MessageTemplateService} from "../../core/message-template.service";
import {MessageTemplateModel} from "../../../core/models/message-template.model";
import {ResponseEntityApi} from "../../../core/models/response-entity-api";
import {SmsTamplateStateService} from "../../../core/services/sms-tamplate-state.service";
import {SmsModel} from "../../../core/models/sms.model";
import {ToastrService} from "ngx-toastr";
import {RecipientsTemplateModel} from "../../../core/models/recipients-template.model";
import {RecipientTemplateService} from "../../core/recipient-template.service";

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
    PopupAddTemplateSms
  ],
  styleUrls: ['./send-sms.component.scss']
})
export class SendSmsComponent implements OnInit {

  constructor(private templateService: MessageTemplateService,
              protected smsTemplateState: SmsTamplateStateService,
              private toaster: ToastrService,
              private recipientService: RecipientTemplateService
  ) {
  }

  modalIsOpened = signal(false);
  @ViewChild('optionDialogComponentRef') optionDialogRef?: SmsModelOptionDialogComponent;
  @ViewChild(PopupAddTemplateSms) popupAddTemplateSms?: PopupAddTemplateSms;
  // Context menu position and data
  contextMenuX = signal(0);
  contextMenuY = signal(0);
  selectedTemplateForPopup = signal<MessageTemplateModel | null>(null);

  sms: SmsModel = {message: "", recipientNumbers: []}
  recipientsTemplateName: string = "";

  selectedList: RecipientsTemplateModel | null = null;
  showMoreRecipients = signal(false);
  recipientSearchTerm = signal('');

  messageTemplates$!: Observable<ResponseEntityApi<MessageTemplateModel[]>>
  recipientTemplates$!: Observable<ResponseEntityApi<RecipientsTemplateModel[]>>
  isLoadingTemplates = signal(true);
  private destroy$ = new Subject<void>();


  showMoreTemplates = signal(false);
  templateSearchTerm = signal('');


  ngOnInit(): void {
    this.loadMessageTemplates();
    this.loadRecipientTemplates();
  }

  get filteredMessageTemplates(): MessageTemplateModel[] {
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
      if (!target.closest('.card[appContextMenuTrigger]') && !target.closest('button[appContextMenuTrigger]')) { // Check if it's NOT a right-click on a context menu trigger card
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

  selectList(list: RecipientsTemplateModel) {
    this.selectedList = this.selectedList === list ? null : list;
    this.recipientsTemplateName = list.templateName
    this.closeContextMenu();
  }

  selectTemplateAndFillMessage(template: MessageTemplateModel | null): void {
    this.smsTemplateState.selectedMessageTemplate = this.smsTemplateState.selectedMessageTemplate === template ? null : template;
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

  get filteredRecipientLists(): RecipientsTemplateModel[] {
    return this.smsTemplateState.recipientsTemplateList.filter(recipes =>
      recipes.templateName.toLowerCase().includes(this.recipientSearchTerm().toLowerCase())
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

      this.popupAddTemplateSms.openModal('Param 1', 'Param 2'); // Ouvrir le modal vide
    }
  }

  addSenderTemplate() {

  }

  // Method called by the ContextMenuTriggerDirective
  onTemplateContextMenu(eventData: { event: MouseEvent, data: MessageTemplateModel | RecipientsTemplateModel }): void {
    const {event, data: template} = eventData;

    // If the same context menu is already open for this template, close it
    if (this.optionDialogRef?.isVisible() && this.selectedTemplateForPopup() === template) {
      this.closeContextMenu();
      return;
    }

    this.closeContextMenu(); // Close any currently open context menu


    this.contextMenuX.set(event.clientX);
    this.contextMenuY.set(event.clientY);
    if (template && (template as MessageTemplateModel).modelName && (template as MessageTemplateModel).smsModel) {
      this.toaster.info("Message Template")

      // @ts-ignore
      this.selectedTemplateForPopup.set(template);

      // @ts-ignore
      this.smsTemplateState.selectedMessageTemplate = template;
    } else if (template as RecipientsTemplateModel) {
      // @ts-ignore
      this.smsTemplateState.recipientsTemplatesList = template
    }
    // Open the context menu component via its ViewChild reference
    if (this.optionDialogRef) {
      this.optionDialogRef.open(template);
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

  loadRecipientTemplates(): void {
    this.isLoadingTemplates.set(true); // Active l'indicateur de chargement
    this.recipientTemplates$ = this.recipientService.getTemplates().pipe(
      finalize(() => this.isLoadingTemplates.set(false)),
      takeUntil(this.destroy$)
    );

    this.recipientTemplates$?.subscribe({
      next: response => {
        if (response.status == "OK") {
          this.smsTemplateState.recipientsTemplateList = response.data
        }
      },
      error: () => {
      },
      complete: () => {
      },
    });
  }
}

import {Component, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {CommonModule} from '@angular/common';
import {SmsTamplateStateService} from "../../../core/services/sms-tamplate-state.service";
import {MessageTemplateModel} from "../../../core/models/message-template.model";
import {MessageTemplateService} from "../../core/message-template.service";

// Interface pour les données du formulaire que le modal émettra

@Component({
  selector: 'app-popup-add-template-sms',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './popup-add-template-sms.html',
  styleUrls: ['./popup-add-template-sms.scss']
})
export class PopupAddTemplateSms implements OnInit {
  openPopup = signal(false);
  formGroup!: FormGroup;

  // --- INPUTS POUR LA CONFIGURATION ---
  @Input() modalTitle: string = 'Formulaire de Modèle SMS';
  @Input() nameLabel: string = 'Nom';
  @Input() namePlaceholder: string = 'Nom du modèle';
  @Input() messageLabel: string = 'Message';
  @Input() messagePlaceholder: string = 'Saisissez le contenu du message';
  @Input() actionButtonText: string = 'Sauvegarder';

  @Input() requireName: boolean = true;
  @Input() requireContent: boolean = true;
  @Input() minLengthContent: number = 10;

  // --- OUTPUTS ---
  @Output() modalClosed = new EventEmitter<void>();
  @Output() onCloseAddModel = new EventEmitter<void>();
  @Output() onReloadModels = new EventEmitter<void>();


  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    protected smsTemplateState: SmsTamplateStateService,
    private templateService: MessageTemplateService,
  ) {
  }

  ngOnInit(): void {
    const nameValidators = this.requireName ? [Validators.required] : [];
    const contentValidators = this.requireContent
      ? [Validators.required, Validators.minLength(this.minLengthContent)]
      : [];

    this.formGroup = this.formBuilder.group({
      id: [''],
      templateName: ['', nameValidators],
      templateContent: ['', contentValidators]
    });
  }

  /**
   * Ouvre le modal et initialise les champs du formulaire avec les valeurs passées.
   * C'est la seule source de vérité pour l'initialisation des valeurs.
   * @param initialName Valeur initiale pour le nom du template.
   * @param initialContent Valeur initiale pour le contenu du template.
   */
  openModal(initialName: string = '', initialContent: string = '') {
    // S'assurer que le formGroup est bien initialisé avant de tenter de le réinitialiser
    if (!this.formGroup) {
      this.ngOnInit();
    }

    this.formGroup.reset({
      id: this.smsTemplateState.selectedMessageTemplate?.id,
      templateName: this.smsTemplateState.selectedMessageTemplate?.modelName,
      templateContent: this.smsTemplateState.selectedMessageTemplate?.smsModel
    });
    this.openPopup.set(true);
  }

  /**
   * Ferme le modal et réinitialise le formulaire.
   */
  closeModal() {
    this.openPopup.set(false);
    this.formGroup.reset();
    this.modalClosed.emit();
    this.onCloseAddModel.emit();
  }

  /**
   * Gère la soumission du formulaire.
   */
  saveTemplate() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.toaster.warning("Veuillez remplir correctement tous les champs requis.");
      return;
    }

    const formOutput: MessageTemplateModel = {
      id: this.formGroup.get("id")?.value,
      modelName: this.formGroup.get("templateName")?.value,
      smsModel: this.formGroup.get("templateContent")?.value
    };

    this.templateService.addTemplate(formOutput)
      .subscribe({
        next: (resp) => {
          if (resp.status === "OK") {
            this.smsTemplateState.messageTemplatesList.push(resp.data);
            this.toaster.success("Réussi");
            this.onReloadModels.emit();
          }
        },
        error: err => {
          this.toaster.error("Une erreur c'est produite")
        }
      });
    this.closeModal()
  }
}

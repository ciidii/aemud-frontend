import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { CampaignService, RecipientGroupDto, SmsModelDTO, CampaignRequestDto } from '../../services/campaign.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NotificationService as AppNotificationService } from '../../../../core/services/notification.service';

// Custom validator to ensure either smsTemplateId OR customMessage is provided, but not both.
const messageContentValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const smsTemplateId = control.get('smsTemplateId');
  const customMessage = control.get('customMessage');

  if (!smsTemplateId || !customMessage) {
    return null; // Controls not yet available
  }

  // This validation should only apply in step 3
  if (control.get('currentStep')?.value !== 3) {
    return null;
  }
  
  const hasTemplate = !!smsTemplateId.value;
  const hasCustomMessage = !!customMessage.value?.trim();
  
  if (hasTemplate && hasCustomMessage) {
    return { bothMessageContentsProvided: true };
  }
  if (!hasTemplate && !hasCustomMessage) {
    return { noMessageContentProvided: true };
  }
  return null;
};

@Component({
  selector: 'app-campaign-creation-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './campaign-creation-wizard.component.html',
  styleUrl: './campaign-creation-wizard.component.scss'
})
export class CampaignCreationWizardComponent implements OnInit {
  @Output() campaignCreated = new EventEmitter<void>();

  isVisible = false;
  currentStep = 1;
  
  wizardForm: FormGroup;
  
  // Step 2 Data
  recipientGroups: RecipientGroupDto[] = [];
  filteredRecipientGroups: RecipientGroupDto[] = [];
  isLoadingGroups = false;
  loadGroupsError: string | null = null;
  selectedGroup: RecipientGroupDto | null = null;

  // Step 3 Data
  messageType: 'template' | 'custom' = 'template';
  messageTemplates: SmsModelDTO[] = [];
  filteredMessageTemplates: SmsModelDTO[] = [];
  isLoadingTemplates = false;
  loadTemplatesError: string | null = null;
  selectedTemplate: SmsModelDTO | null = null;

  // Step 4 Data
  isCreatingCampaign = false;
  
  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private notificationService: AppNotificationService,
  ) {
    this.wizardForm = this.fb.group({
      currentStep: [1], // To help validator
      campaignName: ['', Validators.required],
      recipientGroupId: [null, Validators.required],
      searchKeyword: [''], // For recipient groups
      templateSearchKeyword: [''], // For templates
      smsTemplateId: [null],
      customMessage: ['']
    }, { validators: messageContentValidator });
  }
  
  ngOnInit(): void {
    // Listen for changes in searchKeyword to filter recipient groups
    this.wizardForm.get('searchKeyword')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(keyword => {
        this.filterRecipientGroups(keyword);
      });

    // Listen for changes in templateSearchKeyword for filtering templates
    this.wizardForm.get('templateSearchKeyword')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(keyword => {
        this.filterMessageTemplates(keyword);
      });
  }
  
  open() {
    this.isVisible = true;
  }
  
  close() {
    if (this.isCreatingCampaign) return;
    this.isVisible = false;
    this.currentStep = 1;
    this.wizardForm.reset({ currentStep: 1, searchKeyword: '', templateSearchKeyword: '' });
    this.recipientGroups = [];
    this.filteredRecipientGroups = [];
    this.messageTemplates = [];
    this.filteredMessageTemplates = [];
    this.messageType = 'template';
    this.selectedGroup = null;
    this.selectedTemplate = null;
  }
  
  nextStep() {
    if (this.isStepInvalid(this.currentStep)) {
      return;
    }
    
    if (this.currentStep < 4) {
      this.currentStep++;
      this.wizardForm.get('currentStep')?.setValue(this.currentStep);
      this.handleStepActivation();
    } else {
      // At step 4, the "Next" button becomes "Lancer la campagne"
      this.createCampaign();
    }
  }
  
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.wizardForm.get('currentStep')?.setValue(this.currentStep);
      this.handleStepActivation();
    }
  }

  goToStep(step: number) {
    if (step < this.currentStep) {
      this.currentStep = step;
      this.wizardForm.get('currentStep')?.setValue(this.currentStep);
      this.handleStepActivation();
    }
  }

  isStepInvalid(step: number): boolean {
    if (step === 1) {
      const control = this.wizardForm.get('campaignName');
      control?.markAsTouched();
      return control?.invalid ?? true;
    }
    if (step === 2) {
      const control = this.wizardForm.get('recipientGroupId');
      control?.markAsTouched();
      return control?.invalid ?? true;
    }
    if (step === 3) {
      const form = this.wizardForm;
      form.get('smsTemplateId')?.markAsTouched();
      form.get('customMessage')?.markAsTouched();
      return form.hasError('noMessageContentProvided') || form.hasError('bothMessageContentsProvided');
    }
    return false;
  }
  
  isNextButtonDisabled(): boolean {
    return this.isCreatingCampaign || this.isStepInvalid(this.currentStep);
  }

  handleStepActivation() {
    if (this.currentStep === 2 && this.recipientGroups.length === 0) {
      this.loadRecipientGroups();
    }
    if (this.currentStep === 3 && this.messageType === 'template' && this.messageTemplates.length === 0) {
      this.loadSmsTemplates();
    }
  }

  loadRecipientGroups() {
    this.isLoadingGroups = true;
    this.loadGroupsError = null;
    this.campaignService.getRecipientGroups().subscribe({
      next: (groups) => {
        this.recipientGroups = groups;
        this.filterRecipientGroups(this.wizardForm.get('searchKeyword')?.value);
        this.isLoadingGroups = false;
      },
      error: (err) => {
        console.error(err);
        this.loadGroupsError = "Impossible de charger les groupes de destinataires.";
        this.isLoadingGroups = false;
      }
    });
  }

  filterRecipientGroups(keyword: string): void {
    if (!keyword) {
      this.filteredRecipientGroups = [...this.recipientGroups];
    } else {
      this.filteredRecipientGroups = this.recipientGroups.filter(group =>
        group.name.toLowerCase().includes(keyword.toLowerCase()) ||
        group.description.toLowerCase().includes(keyword.toLowerCase())
      );
    }
  }

  selectGroup(groupId: string) {
    this.wizardForm.get('recipientGroupId')?.setValue(groupId);
    this.selectedGroup = this.recipientGroups.find(g => g.id === groupId) || null;
  }

  setMessageType(type: 'template' | 'custom') {
    this.messageType = type;
    
    if (type === 'template') {
      this.wizardForm.get('customMessage')?.setValue('');
    } else {
      this.wizardForm.get('smsTemplateId')?.setValue(null);
      this.selectedTemplate = null;
    }
    
    if (type === 'template' && this.messageTemplates.length === 0) {
      this.loadSmsTemplates();
    }
    this.wizardForm.updateValueAndValidity();
  }

  loadSmsTemplates() {
    this.isLoadingTemplates = true;
    this.loadTemplatesError = null;
    this.campaignService.getSmsTemplates().subscribe({
      next: (templates) => {
        this.messageTemplates = templates;
        this.filterMessageTemplates(this.wizardForm.get('templateSearchKeyword')?.value);
        this.isLoadingTemplates = false;
      },
      error: (err) => {
        console.error(err);
        this.loadTemplatesError = "Impossible de charger les modèles de message.";
        this.isLoadingTemplates = false;
      }
    });
  }

  filterMessageTemplates(keyword: string): void {
    if (!keyword) {
      this.filteredMessageTemplates = [...this.messageTemplates];
    } else {
      this.filteredMessageTemplates = this.messageTemplates.filter(template =>
        template.modelName.toLowerCase().includes(keyword.toLowerCase()) ||
        template.smsModel.toLowerCase().includes(keyword.toLowerCase())
      );
    }
  }

  selectTemplate(templateId: string) {
    this.wizardForm.get('smsTemplateId')?.setValue(templateId);
    this.selectedTemplate = this.messageTemplates.find(t => t.id === templateId) || null;
  }

  createCampaign() {
    if (this.wizardForm.invalid) {
      return;
    }
    this.isCreatingCampaign = true;
    
    const formValue = this.wizardForm.value;
    const payload: CampaignRequestDto = {
      campaignName: formValue.campaignName,
      recipientGroupId: formValue.recipientGroupId,
      messageTemplateId: formValue.smsTemplateId,
      customMessage: formValue.customMessage
    };

    this.campaignService.createCampaign(payload).subscribe({
      next: () => {
        this.notificationService.showSuccess(`La campagne "${payload.campaignName}" a été lancée.`);
        this.isCreatingCampaign = false;
        this.campaignCreated.emit();
        this.close();
      },
      error: (err) => {
        console.error("Erreur lors de la création de la campagne", err);
        this.notificationService.showError("Échec du lancement de la campagne.");
        this.isCreatingCampaign = false;
      }
    });
  }

  get charCount(): number {
    return this.wizardForm.get('customMessage')?.value?.length || 0;
  }

  get smsCount(): number {
    const len = this.charCount;
    return len === 0 ? 0 : Math.ceil(len / 160);
  }

  getStepClass(step: number): string {
    if (step < this.currentStep) {
      return 'completed';
    }
    if (step === this.currentStep) {
      return 'active';
    }
    return '';
  }
}

import {Component, OnInit, inject} from '@angular/core';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageTemplateService} from '../../services/message-template.service';
import {MessageTemplateModel} from '../../../../core/models/message-template.model';
import {ResponseEntityApi} from '../../../../core/models/response-entity-api';
import {NotificationService as AppNotificationService} from '../../../../core/services/notification.service';

@Component({
  selector: 'app-sms-templates-page',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './sms-templates.page.html',
  styleUrl: './sms-templates.page.scss'
})
export class SmsTemplatesPageComponent implements OnInit {
  templates: MessageTemplateModel[] = [];
  loading = false;
  isFormVisible = false;
  isEditMode = false;
  form!: FormGroup;
  currentTemplate: MessageTemplateModel | null = null;

  private fb = inject(FormBuilder);
  private templateService = inject(MessageTemplateService);
  private appNotificationService = inject(AppNotificationService);

  ngOnInit(): void {
    this.form = this.fb.group({
      modelName: ['', [Validators.required]],
      smsModel: ['', [Validators.required]],
    });
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.loading = true;
    this.templateService.getTemplates().subscribe({
      next: (res: ResponseEntityApi<MessageTemplateModel[]>) => {
        this.templates = res.data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des templates', err);
        this.appNotificationService.showError('Erreur lors du chargement des templates SMS');
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.currentTemplate = null;
    this.form.reset();
    this.isFormVisible = true;
  }

  openEditForm(template: MessageTemplateModel): void {
    this.isEditMode = true;
    this.currentTemplate = template;
    this.form.patchValue({
      modelName: template.modelName,
      smsModel: template.smsModel,
    });
    this.isFormVisible = true;
  }

  cancelForm(): void {
    this.isFormVisible = false;
    this.currentTemplate = null;
    this.form.reset();
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: MessageTemplateModel = {
      id: this.currentTemplate?.id ?? '',
      modelName: this.form.value.modelName,
      smsModel: this.form.value.smsModel,
    };

    if (this.isEditMode && this.currentTemplate) {
      this.templateService.updateTemplate(payload).subscribe({
        next: () => {
          this.appNotificationService.showSuccess('Template mis à jour');
          this.isFormVisible = false;
          this.currentTemplate = null;
          this.loadTemplates();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du template', err);
          this.appNotificationService.showError('Erreur lors de la mise à jour du template');
        }
      });
    } else {
      this.templateService.addTemplate(payload).subscribe({
        next: () => {
          this.appNotificationService.showSuccess('Template créé');
          this.isFormVisible = false;
          this.loadTemplates();
        },
        error: (err) => {
          console.error('Erreur lors de la création du template', err);
          this.appNotificationService.showError('Erreur lors de la création du template');
        }
      });
    }
  }

  deleteTemplate(template: MessageTemplateModel): void {
    if (!confirm(`Supprimer le template "${template.modelName}" ?`)) {
      return;
    }

    this.templateService.deleteTemplate(template.id).subscribe({
      next: () => {
        this.appNotificationService.showSuccess('Template supprimé');
        this.loadTemplates();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du template', err);
        this.appNotificationService.showError('Erreur lors de la suppression du template');
      }
    });
  }
}

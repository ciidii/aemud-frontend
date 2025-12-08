import {Component, EventEmitter, OnInit, Output, inject} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {MessageTemplateService} from '../../../../notification/services/message-template.service';
import {SmsTamplateStateService} from '../../../../notification/services/sms-tamplate-state.service';
import {MessageTemplateModel} from '../../../../../core/models/message-template.model';
import {ResponseEntityApi} from '../../../../../core/models/response-entity-api';
import {NotificationService as AppNotificationService} from '../../../../../core/services/notification.service';

export interface MessageTemplate {
  name: string;
  content: string;
}

@Component({
  selector: 'app-template-select-modal',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './template-select-modal.component.html',
  styleUrl: './template-select-modal.component.scss'
})
export class TemplateSelectModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() templateSelected = new EventEmitter<MessageTemplate>();

  templates: MessageTemplate[] = [];
  loading = false;

  private messageTemplateService = inject(MessageTemplateService);
  private smsTemplateState = inject(SmsTamplateStateService);
  private appNotificationService = inject(AppNotificationService);

  ngOnInit(): void {
    const cachedTemplates = this.smsTemplateState.messageTemplatesList;
    if (cachedTemplates && cachedTemplates.length > 0) {
      this.templates = cachedTemplates.map(t => this.mapToViewModel(t));
      return;
    }

    this.loading = true;
    this.messageTemplateService.getTemplates().subscribe({
      next: (response: ResponseEntityApi<MessageTemplateModel[]>) => {
        const data = response.data || [];
        this.smsTemplateState.messageTemplatesList = data;
        this.templates = data.map(t => this.mapToViewModel(t));
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des templates SMS', error);
        this.loading = false;
        this.appNotificationService.showError('Impossible de charger les templates de message.');
      }
    });
  }

  private mapToViewModel(model: MessageTemplateModel): MessageTemplate {
    return {
      name: model.modelName,
      content: model.smsModel
    };
  }

  selectTemplate(template: MessageTemplate): void {
    this.templateSelected.emit(template);
  }
}

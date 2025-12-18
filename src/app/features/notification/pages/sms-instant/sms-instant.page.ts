import {Component, OnInit, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {TemplateSelectModalComponent, MessageTemplate} from '../../../member/components/member-list/template-select-modal/template-select-modal.component';
import {NotificationService as SmsNotificationService} from '../../services/notification.service';
import {SmsModel} from '../../../../core/models/sms.model';
import {NotificationService as AppNotificationService} from '../../../../core/services/notification.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sms-instant-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    TemplateSelectModalComponent
  ],
  templateUrl: './sms-instant.page.html',
  styleUrl: './sms-instant.page.scss'
})
export class SmsInstantPageComponent implements OnInit {
  form!: FormGroup;
  isTemplateModalOpen = false;
  isSubmitting = false;

  private fb = inject(FormBuilder);
  private smsNotificationService = inject(SmsNotificationService);
  private appNotificationService = inject(AppNotificationService);
  private router = inject(Router);

  get charCount(): number {
    return this.form?.get('message')?.value?.length || 0;
  }

  get smsCount(): number {
    const len = this.charCount;
    return len === 0 ? 1 : Math.ceil(len / 160);
  }

  get recipientCount(): number {
    const raw = this.form?.get('recipients')?.value as string;
    const numbers = this.parseRecipients(raw || '');
    return numbers.length;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      recipients: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });

    // Pré-remplissage depuis la sélection de membres (navigation avec state)
    const navigationState = window.history.state as { recipients?: string[] };
    if (navigationState && Array.isArray(navigationState.recipients) && navigationState.recipients.length > 0) {
      const value = navigationState.recipients.join('\n');
      this.form.patchValue({recipients: value});
    }
  }

  openTemplateModal(): void {
    this.isTemplateModalOpen = true;
  }

  closeTemplateModal(): void {
    this.isTemplateModalOpen = false;
  }

  goToMemberSelection(): void {
    this.router.navigate(['/members/list-members'], {
      queryParams: {smsSelect: true}
    });
  }

  onTemplateSelected(template: MessageTemplate): void {
    this.form.patchValue({message: template.content});
    this.isTemplateModalOpen = false;
  }

  send(): void {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    const rawRecipients = this.form.value.recipients as string;
    const recipientNumbers = this.parseRecipients(rawRecipients);

    if (recipientNumbers.length === 0) {
      this.appNotificationService.showWarning('Aucun destinataire valide détecté.');
      return;
    }

    const payload: SmsModel = {
      message: this.form.value.message,
      recipientNumbers
    };

    this.isSubmitting = true;

    this.smsNotificationService.sendNotification(payload).subscribe({
      next: () => {
        this.appNotificationService.showSuccess('SMS envoyé avec succès');
        this.isSubmitting = false;
        this.form.reset();
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi du SMS', error);
        this.appNotificationService.showError('Erreur lors de l\'envoi du SMS');
        this.isSubmitting = false;
      }
    });
  }

  private parseRecipients(raw: string): string[] {
    return raw
      .split(/[\s,;]+/)
      .map(v => v.trim())
      .filter(v => !!v)
      .map(v => this.normalizePhoneNumber(v))
      .filter((v, i, self) => v.length > 0 && self.indexOf(v) === i);
  }

  private normalizePhoneNumber(raw: string): string {
    if (!raw) {
      return '';
    }
    return raw.replace(/\s+/g, '').replace(/\+/g, '');
  }
}

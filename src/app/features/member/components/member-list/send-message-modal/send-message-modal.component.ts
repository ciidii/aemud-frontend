import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {MessageTemplate, TemplateSelectModalComponent} from '../template-select-modal/template-select-modal.component';
import {NotificationService as SmsNotificationService} from "../../../../notification/services/notification.service";
import {SmsModel} from "../../../../../core/models/sms.model";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-send-message-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    TemplateSelectModalComponent
  ],
  templateUrl: './send-message-modal.component.html',
  styleUrl: './send-message-modal.component.scss'
})
export class SendMessageModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() recipientNumbers: string[] = [];

  messageForm!: FormGroup;
  isTemplateModalOpen = false;
  isSubmitting = false;

  private formBuilder = inject(FormBuilder);
  private smsNotificationService = inject(SmsNotificationService);
  private toastr = inject(ToastrService);

  get charCount(): number {
    return this.messageForm?.get('message')?.value?.length || 0;
  }

  get smsCount(): number {
    const len = this.charCount;
    return len === 0 ? 1 : Math.ceil(len / 160);
  }

  ngOnInit(): void {
    this.messageForm = this.formBuilder.group({
      message: ['', [Validators.required]]
    });
  }

  sendMessage(): void {
    if (this.messageForm.invalid || this.recipientNumbers.length === 0 || this.isSubmitting) {
      return;
    }

    const payload: SmsModel = {
      message: this.messageForm.value.message,
      recipientNumbers: this.recipientNumbers
    };

    this.isSubmitting = true;

    this.smsNotificationService.sendNotification(payload).subscribe({
      next: () => {
        this.toastr.success('Message envoyé avec succès');
        this.isSubmitting = false;
        this.close.emit();
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi du message', error);
        this.toastr.error('Erreur lors de l\'envoi du message');
        this.isSubmitting = false;
      }
    });
  }

  toggleTemplateModal(): void {
    this.isTemplateModalOpen = !this.isTemplateModalOpen;
  }

  onTemplateSelected(template: MessageTemplate): void {
    this.messageForm.patchValue({message: template.content});
    this.isTemplateModalOpen = false; // Close the modal after selection
  }
}

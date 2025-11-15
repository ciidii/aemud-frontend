import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {MessageTemplate, TemplateSelectModalComponent} from '../template-select-modal/template-select-modal.component';

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
  messageForm!: FormGroup;
  isTemplateModalOpen = false;
  private formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.messageForm = this.formBuilder.group({
      message: ['', [Validators.required]]
    });
  }

  sendMessage(): void {
    if (this.messageForm.invalid) {
      return;
    }
    console.log('Sending message:', this.messageForm.value.message);
    this.close.emit();
  }

  toggleTemplateModal(): void {
    this.isTemplateModalOpen = !this.isTemplateModalOpen;
  }

  onTemplateSelected(template: MessageTemplate): void {
    this.messageForm.patchValue({message: template.content});
    this.isTemplateModalOpen = false; // Close the modal after selection
  }
}

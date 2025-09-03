import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './confirm-delete-modal.component.html',
  styleUrl: './confirm-delete-modal.component.scss'
})
export class ConfirmDeleteModalComponent {
  @Input() itemCount = 0;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}
import { Component, ElementRef, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  NotificationPopoverComponent
} from "../../../../../shared/components/notification-popover/notification-popover.component";
@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [
    NgIf,
    NotificationPopoverComponent
  ],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.scss'
})
export class TableHeaderComponent {
  @Output() exportTriggered = new EventEmitter<void>();

  isPopoverOpen = false;
  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isPopoverOpen = false;
    }
  }

  togglePopover(event: Event): void {
    event.stopPropagation();
    this.isPopoverOpen = !this.isPopoverOpen;
  }
}

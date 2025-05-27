import {Component, Input, signal} from '@angular/core';

interface MessageTemplate {
  name: string;
  content: string;
}

@Component({
  selector: 'app-sms-model-option-dialog',
  standalone: true,
  imports: [], // Add NgIf to imports
  templateUrl: './sms-model-option-dialog.component.html',
  styleUrl: './sms-model-option-dialog.component.css'
})
export class SmsModelOptionDialogComponent {
  modalIsOpened = signal(false);
  @Input() set left(value: number) {
    this._left = value;
    this.updatePosition();
  }

  @Input() set top(value: number) {
    this._top = value;
    this.updatePosition();
  }

  private _left = 0;
  private _top = 0;

  private updatePosition() {
    if (typeof window !== 'undefined') {
      // Ajuste la position si le popup dépasse de l'écran
      const popupWidth = 150; // Largeur estimée du popup
      const popupHeight = 80; // Hauteur estimée du popup

      this._left = this._left + popupWidth > window.innerWidth
        ? window.innerWidth - popupWidth - 10
        : this._left;

      this._top = this._top + popupHeight > window.innerHeight
        ? window.innerHeight - popupHeight - 10
        : this._top;
    }
  }

  openSendSmsModal() {
    this.modalIsOpened.set(true);
  }

  close() {
    this.modalIsOpened.set(false);
  }

  onModifyClick() {
    // @ts-ignore
    this.modifyClicked.emit(this.template);
    this.close(); // Close the popup after action
  }

  onDeleteClick() {
    // @ts-ignore
    this.deleteClicked.emit(this.template);
    this.close(); // Close the popup after action
  }
}

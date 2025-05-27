import { Component, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import {NgIf} from "@angular/common";

interface SMS {
  recipient: string;
  message: string;
  scheduleDate: Date;
}

@Component({
  selector: 'app-schedule-sms',
  templateUrl: './schedule-sms.component.html',
  standalone: true,
  imports: [FormsModule, NgIf],
  styleUrls: ['./schedule-sms.component.scss']
})
export class ScheduleSmsComponent {
  sms: SMS = { recipient: '', message: '', scheduleDate: new Date() };
  modalIsOpened = signal(false);

  scheduleSms() {
    if (!this.sms.recipient || !this.sms.message || !this.sms.scheduleDate) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    alert("SMS programmé avec succès !");
  }

  openModal() {
    this.modalIsOpened.set(true);
  }

  close() {
    this.modalIsOpened.set(false);
  }
}

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, title: string = 'Succès'): void {
    this.toastr.success(message, title, {
      closeButton: true,
      progressBar: true,
      timeOut: 5000, // 5 seconds
      positionClass: 'toast-top-right'
    });
  }

  showError(message: string, title: string = 'Erreur'): void {
    this.toastr.error(message, title, {
      closeButton: true,
      progressBar: true,
      timeOut: 8000, // 8 seconds for errors
      positionClass: 'toast-top-right'
    });
  }

  showInfo(message: string, title: string = 'Information'): void {
    this.toastr.info(message, title, {
      closeButton: true,
      progressBar: true,
      timeOut: 5000,
      positionClass: 'toast-top-right'
    });
  }

  showWarning(message: string, title: string = 'Avertissement'): void {
    this.toastr.warning(message, title, {
      closeButton: true,
      progressBar: true,
      timeOut: 6000,
      positionClass: 'toast-top-right'
    });
  }
}

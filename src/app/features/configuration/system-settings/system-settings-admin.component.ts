import {Component, OnInit} from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {SystemSettingModel, SystemSettingsService} from '../services/system-settings.service';

@Component({
  selector: 'app-system-settings-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './system-settings-admin.component.html',
  styleUrls: ['./system-settings-admin.component.scss']
})
export class SystemSettingsAdminComponent implements OnInit {
  isLoading: boolean = false;
  isSaving: boolean = false;

  // Modèles de configuration
  initialRegistrationFee: number = 2000;
  reregistrationFee: number = 1000;
  wavePaymentPhone: string = '+221 77 123 45 67';
  orangeMoneyPhone: string = '+221 78 123 45 67';
  smsCostPerUnit: number = 20;

  private allSettings: SystemSettingModel[] = [];

  constructor(
    private systemSettingsService: SystemSettingsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading = true;
    this.systemSettingsService.getAllSettings().subscribe({
      next: (settings) => {
        this.allSettings = settings;
        this.populateForm(settings);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load settings', err);
        this.toastr.error('Impossible de charger les paramètres système.', 'Erreur');
      }
    });
  }

  private populateForm(settings: SystemSettingModel[]): void {
    settings.forEach(s => {
      switch (s.key) {
        case 'REGISTRATION_FEE_INITIAL':
          this.initialRegistrationFee = parseFloat(s.value) || 2000;
          break;
        case 'REGISTRATION_FEE_REREGISTRATION':
          this.reregistrationFee = parseFloat(s.value) || 1000;
          break;
        case 'WAVE_PAYMENT_PHONE':
          this.wavePaymentPhone = s.value || '+221 77 123 45 67';
          break;
        case 'ORANGE_MONEY_PHONE':
          this.orangeMoneyPhone = s.value || '+221 78 123 45 67';
          break;
        case 'SMS_COST_PER_UNIT':
          this.smsCostPerUnit = parseFloat(s.value) || 20;
          break;
      }
    });
  }

  saveSettings(): void {
    this.isSaving = true;

    const settingsToSave: SystemSettingModel[] = [
      {
        key: 'REGISTRATION_FEE_INITIAL',
        value: this.initialRegistrationFee.toString(),
        description: 'Frais de 1ère inscription pour nouvel étudiant (FCFA).'
      },
      {
        key: 'REGISTRATION_FEE_REREGISTRATION',
        value: this.reregistrationFee.toString(),
        description: 'Frais de réinscription pour renouvellement de phase (FCFA).'
      },
      {
        key: 'WAVE_PAYMENT_PHONE',
        value: this.wavePaymentPhone,
        description: 'Numéro Wave officiel AEMUD pour les réceptions de paiements.'
      },
      {
        key: 'ORANGE_MONEY_PHONE',
        value: this.orangeMoneyPhone,
        description: 'Numéro Orange Money officiel AEMUD pour les paiements.'
      },
      {
        key: 'SMS_COST_PER_UNIT',
        value: this.smsCostPerUnit.toString(),
        description: 'Coût unitaire d\'un SMS Orange en FCFA.'
      }
    ];

    this.systemSettingsService.updateAllSettings(settingsToSave).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.allSettings = res;
        this.toastr.success('Paramètres des frais et moyens de paiement mis à jour avec succès.', 'Succès');
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Failed to save settings', err);
        this.toastr.error('Erreur lors de l\'enregistrement des paramètres.', 'Erreur');
      }
    });
  }
}

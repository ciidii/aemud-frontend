import {Component, OnInit} from '@angular/core';
import {CommonModule, CurrencyPipe, DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {FormSchema} from '../../../../core/models/form-schema.model';
import {FormSchemaService} from '../../../../core/services/form-schema.service';
import {BourseService} from '../../../configuration/services/bourse.service';
import {DynamicFormComponent} from '../../../../shared/components/dynamic-form/dynamic-form.component';
import {environment} from '../../../../../environments/environment';
import {ResponseEntityApi} from '../../../../core/models/response-entity-api';

export type CensusStep = 'FORM' | 'PAYMENT' | 'SUCCESS';

export interface CensusReceipt {
  registrationId: string;
  memberId: string;
  memberName: string;
  mandatName: string;
  phaseName: string;
  registrationType: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  receiptNumber: string;
  statusPayment: boolean;
}

export interface CensusStatus {
  isOpen: boolean;
  message: string;
  activeMandatName: string;
  activePhaseName: string;
}

@Component({
  selector: 'app-census-page',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './census-page.component.html',
  styleUrls: ['./census-page.component.scss']
})
export class CensusPageComponent implements OnInit {
  schema: FormSchema | null = null;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  currentStep: CensusStep = 'FORM';

  censusStatus: CensusStatus | null = null;

  submittedMember: any = null;
  selectedPaymentMethod: 'WAVE_MONEY' | 'ORANGE_MONEY' | 'CASH' = 'WAVE_MONEY';
  omPhoneNumber: string = '';
  isProcessingPayment: boolean = false;
  feeAmount: number = 2000;
  wavePaymentPhone: string = '+221 77 123 45 67';
  receipt: CensusReceipt | null = null;
  paidLater: boolean = false;

  constructor(
    private formSchemaService: FormSchemaService,
    private bourseService: BourseService,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkStatusAndLoadData();
  }

  private checkStatusAndLoadData(): void {
    this.isLoading = true;
    const statusUrl = `${environment.API_URL}/census/status`;

    this.http.get<ResponseEntityApi<CensusStatus>>(statusUrl).subscribe({
      next: (res) => {
        this.censusStatus = res.data;
        if (this.censusStatus && !this.censusStatus.isOpen) {
          this.isLoading = false;
          return;
        }
        this.loadSchemaAndData();
      },
      error: () => {
        // En cas d'erreur de récupération du statut, on tente le chargement classique
        this.loadSchemaAndData();
      }
    });
  }

  private loadSchemaAndData(): void {
    this.formSchemaService.getFormSchema().subscribe({
      next: schema => {
        this.bourseService.getAllBourses().subscribe({
          next: bourses => {
            const academicGroup = schema.groups.find(g => g.code === 'ACADEMIC_INFO');
            if (academicGroup) {
              const bourseField = academicGroup.fields.find(f => f.key === 'bourseId');
              if (bourseField && bourses && bourses.length > 0) {
                bourseField.options = bourses.map(b => b.libelle);
              }
            }
            this.schema = schema;
            this.isLoading = false;
          },
          error: () => {
            this.schema = schema;
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.toastr.error('Impossible de charger le formulaire de recensement.', 'Erreur');
        this.isLoading = false;
      }
    });
  }

  handleFormSubmit(payload: Record<string, any>): void {
    this.isSubmitting = true;
    const apiUrl = `${environment.API_URL}/census/self-register`;

    this.http.post<ResponseEntityApi<any>>(apiUrl, payload).subscribe({
      next: response => {
        this.isSubmitting = false;
        this.submittedMember = response.data;
        this.omPhoneNumber = payload['phoneNumber'] || '';

        // Si Alumni : pas de frais de scolarité étudiant, direct succès
        const isStudent = payload['isStudent'] === undefined || payload['isStudent'] === true || payload['isStudent'] === 'true';
        if (!isStudent) {
          this.currentStep = 'SUCCESS';
          this.toastr.success('Votre inscription au réseau Alumni a été enregistrée avec succès !', 'Bienvenue');
        } else {
          this.currentStep = 'PAYMENT';
          this.toastr.success('Informations enregistrées ! Veuillez choisir votre option de règlement des frais d\'adhésion.', 'Étape 2');
        }
      },
      error: err => {
        this.isSubmitting = false;
        const msg = err.error?.message || "Une erreur est survenue lors de l'enregistrement.";
        this.toastr.error(msg, 'Erreur de soumission');
      }
    });
  }

  confirmOnlinePayment(): void {
    if (!this.submittedMember?.id) return;

    this.isProcessingPayment = true;
    const apiUrl = `${environment.API_URL}/census/${this.submittedMember.id}/pay-fee`;

    const payload = {
      amount: this.feeAmount,
      paymentMethod: this.selectedPaymentMethod,
      notes: `Paiement en ligne portail public (${this.selectedPaymentMethod === 'WAVE_MONEY' ? 'Wave' : 'Orange Money'})`
    };

    this.http.post<ResponseEntityApi<CensusReceipt>>(apiUrl, payload).subscribe({
      next: response => {
        this.isProcessingPayment = false;
        this.receipt = response.data;
        this.paidLater = false;
        this.currentStep = 'SUCCESS';
        this.toastr.success('Paiement validé avec succès ! Votre quittance d\'adhésion est disponible.', 'Adhésion confirmée');
      },
      error: err => {
        this.isProcessingPayment = false;
        const msg = err.error?.message || "Échec de l'enregistrement du paiement.";
        this.toastr.error(msg, 'Erreur paiement');
      }
    });
  }

  choosePayLater(): void {
    this.paidLater = true;
    this.currentStep = 'SUCCESS';
    this.toastr.info('Adhésion enregistrée. Vous pourrez régler vos frais en espèces auprès du trésorier.', 'Paiement différé');
  }

  printReceipt(): void {
    window.print();
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}

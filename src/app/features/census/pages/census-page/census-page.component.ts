import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {FormSchema} from '../../../../core/models/form-schema.model';
import {FormSchemaService} from '../../../../core/services/form-schema.service';
import {BourseService} from '../../../configuration/services/bourse.service';
import {DynamicFormComponent} from '../../../../shared/components/dynamic-form/dynamic-form.component';
import {environment} from '../../../../../environments/environment';
import {ResponseEntityApi} from '../../../../core/models/response-entity-api';

@Component({
  selector: 'app-census-page',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './census-page.component.html',
  styleUrls: ['./census-page.component.scss']
})
export class CensusPageComponent implements OnInit {
  schema: FormSchema | null = null;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  isSubmittedSuccess: boolean = false;
  submittedMember: any = null;

  constructor(
    private formSchemaService: FormSchemaService,
    private bourseService: BourseService,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSchemaAndData();
  }

  private loadSchemaAndData(): void {
    this.isLoading = true;
    this.formSchemaService.getFormSchema().subscribe({
      next: schema => {
        // Chargement dynamique des bourses pour enrichir le champ bourseId
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
      error: err => {
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
        this.isSubmittedSuccess = true;
        this.submittedMember = response.data;
        this.toastr.success('Votre auto-recensement a été enregistré avec succès !', 'Félicitations');
      },
      error: err => {
        this.isSubmitting = false;
        const msg = err.error?.message || "Une erreur est survenue lors de l'enregistrement.";
        this.toastr.error(msg, 'Erreur de soumission');
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}

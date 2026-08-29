import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Router, RouterModule} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {FormSchema} from '../../../../core/models/form-schema.model';
import {FormSchemaService} from '../../../../core/services/form-schema.service';
import {BourseService} from '../../../configuration/services/bourse.service';
import {DynamicFormComponent} from '../../../../shared/components/dynamic-form/dynamic-form.component';
import {environment} from '../../../../../environments/environment';
import {ResponseEntityApi} from '../../../../core/models/response-entity-api';

@Component({
  selector: 'app-member-add',
  standalone: true,
  imports: [CommonModule, RouterModule, DynamicFormComponent],
  templateUrl: './member-add.component.html',
  styleUrls: ['./member-add.component.scss']
})
export class MemberAddComponent implements OnInit {
  schema: FormSchema | null = null;
  isLoading: boolean = true;
  isSubmitting: boolean = false;

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
      next: (schema: FormSchema) => {
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
        this.toastr.error('Impossible de charger le formulaire d\'inscription.', 'Erreur');
        this.isLoading = false;
      }
    });
  }

  onFormSubmit(payload: Record<string, any>): void {
    this.isSubmitting = true;
    const apiUrl = `${environment.API_URL}/census/self-register`;

    this.http.post<ResponseEntityApi<any>>(apiUrl, payload).subscribe({
      next: response => {
        this.isSubmitting = false;
        this.toastr.success('Membre inscrit avec succès !', 'Inscription Réussie');
        const createdMember = response.data;
        if (createdMember?.id) {
          this.router.navigate(['/members/details', createdMember.id]);
        } else {
          this.router.navigate(['/members/list-members']);
        }
      },
      error: (err: any) => {
        this.isSubmitting = false;
        const msg = err.error?.message || "Une erreur est survenue lors de l'enregistrement du membre.";
        this.toastr.error(msg, 'Erreur');
      }
    });
  }
}

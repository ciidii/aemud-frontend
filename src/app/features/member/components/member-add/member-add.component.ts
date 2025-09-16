import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {PersonalInfoFormComponent} from "./personal-info-form/personal-info-form.component";
import {ContactInfoFormComponent} from "./contact-info-form/contact-info-form.component";
import {AcademicInfoFormComponent} from "./academic-info-form/academic-info-form.component";
import {ReligiousKnowledgeFormComponent} from "./religious-knowledge-form/religious-knowledge-form.component";
import {EngagementsFormComponent} from "./engagements-form/engagements-form.component";
import {BourseService} from "../../../configuration/services/bourse.service";
import {ClubService} from "../../../configuration/services/club.service";
import {CommissionService} from "../../../configuration/services/commission.service";
import {MemberHttpService} from "../../services/member.http.service";
import {forkJoin} from "rxjs";
import {Bourse, Club, Commission} from "../../../../core/models/member-data.model";
import {Router} from "@angular/router";
import {NotificationService} from "../../../../core/services/notification.service";

@Component({
  selector: 'app-member-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PersonalInfoFormComponent,
    ContactInfoFormComponent,
    AcademicInfoFormComponent,
    ReligiousKnowledgeFormComponent,
    EngagementsFormComponent
  ],
  templateUrl: './member-add.component.html',
  styleUrls: ['./member-add.component.scss']
})
export class MemberAddComponent implements OnInit {

  @ViewChild(PersonalInfoFormComponent) personalInfoFormComponent!: PersonalInfoFormComponent;
  @ViewChild(ContactInfoFormComponent) contactInfoFormComponent!: ContactInfoFormComponent;
  @ViewChild(AcademicInfoFormComponent) academicInfoFormComponent!: AcademicInfoFormComponent;
  @ViewChild(ReligiousKnowledgeFormComponent) religiousKnowledgeFormComponent!: ReligiousKnowledgeFormComponent;
  @ViewChild(EngagementsFormComponent) engagementsFormComponent!: EngagementsFormComponent;

  mainForm!: FormGroup;
  currentStep = 1;

  bourses: Bourse[] = [];
  clubs: Club[] = [];
  commissions: Commission[] = [];

  constructor(
    private fb: FormBuilder,
    private bourseService: BourseService,
    private clubService: ClubService,
    private commissionService: CommissionService,
    private memberHttpService: MemberHttpService,
    private router: Router,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.mainForm = this.fb.group({
      personalInfo: [null, Validators.required],
      contactInfo: [null, Validators.required],
      academicInfo: [null, Validators.required],
      religiousKnowledge: [null],
      engagements: [null]
    });

  }

  loadInitialData(): void {
    forkJoin({
      bourses: this.bourseService.getAllBourses(),
      clubs: this.clubService.getAllClubs(),
      commissions: this.commissionService.getAllCommissions()
    }).subscribe(({bourses, clubs, commissions}) => {
      this.bourses = bourses;
      this.clubs = clubs;
      this.commissions = commissions;
    });
  }

  get currentStepControl() {
    switch (this.currentStep) {
      case 1:
        return this.mainForm.get('personalInfo');
      case 2:
        return this.mainForm.get('contactInfo');
      case 3:
        return this.mainForm.get('academicInfo');
      case 4:
        return this.mainForm.get('religiousKnowledge');
      case 5:
        return this.mainForm.get('engagements');
      default:
        return null;
    }
  }

  nextStep() {
    if (this.currentStepControl?.invalid) {
      switch (this.currentStep) {
        case 1:
          this.personalInfoFormComponent.personalInfoForm.markAllAsTouched();
          break;
        case 2:
          this.contactInfoFormComponent.contactInfoForm.markAllAsTouched();
          break;
        case 3:
          this.academicInfoFormComponent.academicInfoForm.markAllAsTouched();
          break;
        case 4:
          this.religiousKnowledgeFormComponent.religiousKnowledgeForm.markAllAsTouched();
          break;
        case 5:
          this.engagementsFormComponent.engagementsForm.markAllAsTouched();
          break;
      }
      return;
    }
    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.mainForm.valid) {
      const finalData = this.mapFormToRequest(this.mainForm.getRawValue());
      this.memberHttpService.addMember(finalData).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Membre ajouté avec succès !');
          // @ts-ignore
          this.router.navigate(['/members/details', response.data.id]);
        },
        error: (err) => {
          console.error('Error adding member', err);
          this.notificationService.showError("Erreur lors de l'ajout du membre.");
        }
      });
    } else {
      console.log('Form is invalid');
      this.mainForm.markAllAsTouched();
    }
  }

  private mapFormToRequest(formValue: any): any {
    const { personalInfo, contactInfo, academicInfo, religiousKnowledge, engagements } = formValue;

    return {
      personalInfo: personalInfo,
      contactInfo: {
        numberPhone: contactInfo.numberPhone,
        email: contactInfo.email,
        personToCalls: contactInfo.personToCalls
      },
      addressInfo: {
        addressInDakar: contactInfo.addressInDakar,
        addressOnCampus: contactInfo.addressOnCampus
      },
      academicInfo: {
        institutionName: academicInfo.institutionName,
        studiesDomain: academicInfo.studiesDomain,
        studiesLevel: academicInfo.studiesLevel
      },
      membershipInfo: {
        legacyInstitution: academicInfo.legacyInstitution,
        bacSeries: academicInfo.bacSeries,
        bacMention: academicInfo.bacMention,
        yearOfBac: academicInfo.yearOfBac,
        aemudCourses: academicInfo.aemudCourses,
        otherCourses: academicInfo.otherCourses,
        participatedActivity: academicInfo.participatedActivity,
        politicOrganisation: academicInfo.politicOrganisation
      },
      religiousKnowledge: religiousKnowledge,
      bourse: engagements.bourse,
      clubs: engagements.clubs,
      commissions: engagements.commissions,
    };
  }
}


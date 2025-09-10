import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {PersonalInfoFormComponent} from "./personal-info-form/personal-info-form.component";
import {ContactInfoFormComponent} from "./contact-info-form/contact-info-form.component";
import {AcademicInfoFormComponent} from "./academic-info-form/academic-info-form.component";
import {ReligiousKnowledgeFormComponent} from "./religious-knowledge-form/religious-knowledge-form.component";
import {EngagementsFormComponent} from "./engagements-form/engagements-form.component";
import {Bourse, Club, Commission} from "../../../../core/models/member-data.model";

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
  styleUrl: './member-add.component.scss'
})
export class MemberAddComponent implements OnInit {

  mainForm!: FormGroup;
  currentStep = 1;

  // Données Mock - à remplacer par un appel de service
  bourses: Bourse[] = [{ bourseId: '1', lebelle: 'Bourse d\'excellence', montant: 50000, members: [] }];
  clubs: Club[] = [{ id: 'C1', name: 'Club Informatique', members: [] }, { id: 'C2', name: 'Club Anglais', members: [] }];
  commissions: Commission[] = [{ id: 'CO1', name: 'Commission Sociale', members: [] }, { id: 'CO2', name: 'Commission Culturelle', members: [] }];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.mainForm = this.fb.group({
      personalInfo: [null, Validators.required],
      contactInfo: [null, Validators.required],
      academicInfo: [null, Validators.required],
      religiousKnowledge: [null],
      engagements: [null]
    });
  }

  get currentStepControl() {
    switch (this.currentStep) {
      case 1: return this.mainForm.get('personalInfo');
      case 2: return this.mainForm.get('contactInfo');
      case 3: return this.mainForm.get('academicInfo');
      case 4: return this.mainForm.get('religiousKnowledge');
      case 5: return this.mainForm.get('engagements');
      default: return null;
    }
  }

  nextStep() {
    if (this.currentStepControl?.invalid) {
      this.currentStepControl.markAllAsTouched();
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
      const finalData = this.mainForm.getRawValue();
      console.log('--- Form Data ---');
      console.log(finalData);
      alert('Formulaire soumis ! Voir la console pour les données.');
    } else {
      console.log('Form is invalid');
      this.mainForm.markAllAsTouched();
    }
  }
}


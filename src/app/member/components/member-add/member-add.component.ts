import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {CommissionModel} from "../../../core/models/commission.model";
import {ClubModel} from "../../../core/models/club.model";
import {BourseModel} from "../../../core/models/bourse.model";
import {MemberService} from "../../core/member.service";
import {ToastrService} from "ngx-toastr";
import {CommissionService} from "../../../core/services/commission.service";
import {ClubService} from "../../../core/services/club.service";
import {BourseService} from "../../../core/services/bourse.service";


@Component({
  selector: 'app-add-member',
  templateUrl: './member-add.component.html',
  styleUrls: ['./member-add.component.css'],
  imports: [
    RouterModule,
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  standalone: true
})
export class MemberAddComponent implements OnInit {
  memberForm!: FormGroup;
  commissions!: Array<CommissionModel>;
  clubs!: Array<ClubModel>;
  bourses!: Array<BourseModel>;
  membershipInfoGroup!: FormGroup;
  academicInfoGroup!: FormGroup;
  contactGroup!: FormGroup;
  personalInfoGroup!: FormGroup;
  personToCallsArray!: FormArray;
  maxDate!: String;

  constructor(
    private memberService: MemberService,
    private toaster: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private commissionService: CommissionService,
    private clubService: ClubService,
    private bourseService: BourseService
  ) {
  }

  ngOnInit(): void {
    const today = new Date();
    const tenYearsAgo = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
    this.maxDate = tenYearsAgo.toISOString().split('T')[0];

    this.initMemberForm();
    this.loadAdditionalData();
  }

  loadAdditionalData() {
    this.commissionService.getCommissions().subscribe({
      next: data => {
        if (data.status === "OK" && data.result === "Succeeded") {
          this.commissions = data.data;
        } else {
          this.toaster.error("Une erreur inattendue s'est produite côté serveur.");
        }
      },
      error: err => {
        this.toaster.error("Une erreur s'est produite lors de la récupération des commissions.");
      }
    });

    this.clubService.getClubs().subscribe({
      next: data => {
        if (data.status === "OK" && data.result === "Succeeded") {
          this.clubs = data.data;
        } else {
          this.toaster.error("Une erreur s'est produite lors de la récupération des clubs.");
        }
      },
      error: err => {
        this.toaster.error("Une erreur s'est produite côté serveur.");
      }
    });

    this.bourseService.getAllBourse().subscribe({
      next: data => {
        if (data.status === "OK" && data.result === "Succeeded") {
          this.bourses = data.data;
        }
      },
      error: err => {
        this.toaster.error("Une erreur s'est produite côté serveur.");
      }
    });
  }


  get membershipInfo(): FormGroup {
    return this.membershipInfoGroup;
  }

  get academicInfo(): FormGroup {
    return this.academicInfoGroup;
  }

  get contactInfo(): FormGroup {
    return this.contactGroup;
  }

  get personalInfo(): FormGroup {
    return this.personalInfoGroup;
  }

  get personToCalls(): FormArray {
    return this.personToCallsArray;
  }

  initMemberForm() {
    this.memberForm = this.fb.group({
      personalInfo: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        firstname: ['', [Validators.required, Validators.minLength(2)]],
        nationality: ['', [Validators.required, Validators.minLength(2)]],
        birthday: ['', [Validators.required]],
        maritalStatus: ['', [Validators.required, Validators.minLength(2)]]
      }),
      membershipInfo: this.fb.group({
        yearOfBac: ['', [Validators.required, Validators.minLength(3)]],
        bacSeries: ['', [Validators.required, Validators.minLength(2)]],
        bacMention: ['', [Validators.required, Validators.minLength(3)]],
        legacyInstitution: ['', [Validators.required, Validators.minLength(3)]],
        aemudCourses: ['', [Validators.required]],
        otherCourses: ['', [Validators.required, Validators.minLength(5)]],
        participatedActivity: ['', [Validators.required]],
        politicOrganisation: ['', [Validators.required]],
        bourse: [''],
        commission: [''],
        clubs: [''],
      }),
      academicInfo: this.fb.group({
        studiesLevel: ['', [Validators.required, Validators.minLength(3)]],
        institutionName: ['', [Validators.required, Validators.minLength(3)]],
        studiesDomain: ['', [Validators.required, Validators.minLength(3)]],
      }),
      addressInfo: this.fb.group({
        addressInDakar: ['', [Validators.required, Validators.minLength(3)]],
        holidayAddress: ['', [Validators.required, Validators.minLength(3)]],
        addressToCampus: ['', [Validators.required, Validators.minLength(3)]],
      }),
      contactInfo: this.fb.group({
        numberPhone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
        email: ['', [Validators.required, Validators.email]],
        personToCalls: this.fb.array([]),
      }),
    });

    // Initialize form groups
    this.membershipInfoGroup = this.memberForm.get('membershipInfo') as FormGroup;
    this.academicInfoGroup = this.memberForm.get('academicInfo') as FormGroup;
    this.contactGroup = this.memberForm.get('contactInfo') as FormGroup;
    this.personToCallsArray = this.contactInfo.get('personToCalls') as FormArray;
    this.personalInfoGroup = this.memberForm.get("personalInfo") as FormGroup;

    // Add at least one person to call
    this.addPersonToCall();
  }

  addPersonToCall(person?: any): void {
    const personFormGroup = this.fb.group({
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      requiredNumberPhone: [
        '',
        [Validators.required, Validators.pattern(/^\d{9}$/)],
      ],
      optionalNumberPhone: [
        '',
        Validators.pattern(/^\d{9}$/),
      ],
      relationship: ['', Validators.required],
    });

    this.personToCalls.push(personFormGroup);
  }

  removePersonToCall(index: number): void {
    this.personToCalls.removeAt(index);
  }

  onSubmit() {
    if (this.memberForm.valid) {
      const formValue = this.memberForm.value;

      // Add +221 prefix to phone numbers
      const contactInfoWithPrefix = {
        ...formValue.contactInfo,
        numberPhone: '+221' + formValue.contactInfo.numberPhone,
        personToCalls: formValue.contactInfo.personToCalls.map((person: any) => ({
          ...person,
          requiredNumberPhone: '+221' + person.requiredNumberPhone,
          optionalNumberPhone: person.optionalNumberPhone ? '+221' + person.optionalNumberPhone : ''
        }))
      };

      // Format the data for the API
      const memberData = {
        personalInfo: formValue.personalInfo,
        membershipInfo: formValue.membershipInfo,
        academicInfo: formValue.academicInfo,
        addressInfo: formValue.addressInfo,
        contactInfo: contactInfoWithPrefix,
        bourse: {
          bourseId: formValue.membershipInfo.bourse
        },
        clubs: formValue.membershipInfo.clubs ? [{id: formValue.membershipInfo.clubs}] : [],
        commissions: formValue.membershipInfo.commission ? [{id: formValue.membershipInfo.commission}] : []
      };

      // Call the service to add the member
      this.memberService.addMember(memberData).subscribe({
        next: (response) => {
          if (response.result=="Succeeded") {
            this.toaster.success("Membre ajouté avec succès");
            this.router.navigateByUrl(`/members/member-details/${response.data.id}`);
          }
        },
        error: (err) => {
          this.toaster.error("Une erreur s'est produite lors de l'ajout du membre");
        }
      });
    } else {
      this.toaster.error("Veuillez remplir correctement tous les champs obligatoires");
      this.markFormGroupTouched(this.memberForm);
    }
  }

  // Helper method to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }

      if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          }
        });
      }
    });
  }
}

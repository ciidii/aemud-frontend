import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MemberService} from "../../../core/services/member.service";
import {Title} from "@angular/platform-browser";
import {Profile} from "../../../core/profile.model";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ToastrService} from "ngx-toastr";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommissionService} from "../../../core/services/commission/commission.service";
import {ClubService} from "../../../core/services/clubs/club.service";
import {BourseService} from "../../../core/services/Bourse/bourse.service";
import {Commission} from "../../../core/models/Commission/Commission";
import {ClubModel} from "../../model/club.model";
import {BourseModel} from "../../../core/models/bourses/bourse.model";

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ]
})
export class MemberDetailsComponent implements OnInit {
  memberID: string | null = "";
  memberForm!: FormGroup;
  commissions!: Array<Commission>;
  clubs!: Array<ClubModel>;
  member!: Profile;
  bourses!: Array<BourseModel>
  isEditingMembershipInfo: boolean = false;
  isEditingAcademicInfo: boolean = false;
  isEditingContactInfo: boolean = false;
  isPersonalInfoEditing: boolean = false;
  membershipInfoGroup!: FormGroup;
  academicInfoGroup!: FormGroup;
  contactGroup!: FormGroup;
  personalInfoGroup!: FormGroup;
  personToCallsArray!: FormArray;
  maxDate!: String


  constructor(private router: ActivatedRoute,
              private memberService: MemberService,
              private titleService: Title,
              private toasterService: ToastrService,
              private routeService: Router,
              private fb: FormBuilder,
              private commissionService: CommissionService,
              private clubService: ClubService,
              private bourseService: BourseService,
              private toaster: ToastrService
  ) {
  }

  ngOnInit(): void {
    const today = new Date();
    const tenYearsAgo = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
    this.maxDate = tenYearsAgo.toISOString().split('T')[0];


    this.memberID = this.router.snapshot.paramMap.get('member-id');
    this.memberService.getMemberById(this.memberID).subscribe({
      next: response => {
        if (response.status === "OK") {
          this.member = response.data;
          this.initTitle(this.member);
          this.initMemberForm(this.member);
        }
      },
      error: err => {
        this.toaster.error("Une erreur s'est produite lors de la récupération des données.");
      }
    });

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


  initTitle(member: Profile | undefined) {
    if (member?.personalInfo) {
      this.titleService.setTitle(`${member.personalInfo.name} ${member.personalInfo.firstname}`)
    } else {
      this.titleService.setTitle("Not found")
    }
  }

  deleteProfile() {
    this.memberService.deleteMember(this.memberID).subscribe({
      next: resp => {
        this.toasterService.success("Suppression réussi");
        this.routeService.navigateByUrl("/members/member/list-members")
      }, error: err => {
        this.toasterService.error("Une erreur s'est produite")
      }
    })
  }

  get membershipInfo(): FormGroup {

    return this.membershipInfoGroup
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

  protected readonly FormGroup = FormGroup;

  toggleEditMembershipInfo(): void {
    this.isEditingMembershipInfo = !this.isEditingMembershipInfo;
  }

  toggleEditingAcademicInfo(): void {
    this.isEditingAcademicInfo = !this.isEditingAcademicInfo;
  }

  toggleEditingContactInfo(): void {
    this.isEditingContactInfo = !this.isEditingContactInfo;
  }

  togglePersonalInfoInfo(): void {
    this.isPersonalInfoEditing = !this.isPersonalInfoEditing;
  }

  initMemberForm(member: Profile) {
    if (!member) {
      console.error("Les données du membre ne sont pas disponibles.");
      return;
    }

    this.memberForm = this.fb.group({
      personalInfo: this.fb.group({
        id: [member.id],
        name: [member.personalInfo?.name || '', [Validators.required, Validators.minLength(2)]],
        firstname: [member.personalInfo?.firstname || '', [Validators.required, Validators.minLength(2)]],
        nationality: [member.personalInfo?.nationality || '', [Validators.required, Validators.minLength(2)]],
        birthday: [member.personalInfo?.birthday || '', [Validators.required]],
        maritalStatus: [member.personalInfo?.maritalStatus || '', [Validators.required, Validators.minLength(2)]],
      }),
      membershipInfo: this.fb.group({
        yearOfBac: [member.membershipInfo?.yearOfBac || '', [Validators.required, Validators.minLength(3)]],
        bacSeries: [member.membershipInfo?.bacSeries || '', [Validators.required, Validators.minLength(2)]],
        bacMention: [member.membershipInfo?.bacMention || '', [Validators.required, Validators.minLength(3)]],
        legacyInstitution: [member.membershipInfo?.legacyInstitution || '', [Validators.required, Validators.minLength(3)]],
        aemudCourses: [member.membershipInfo?.aemudCourses || '', [Validators.required]],
        otherCourses: [member.membershipInfo?.otherCourses || '', [Validators.required, Validators.minLength(5)]],
        participatedActivity: [member.membershipInfo?.participatedActivity || '', [Validators.required]],
        politicOrganisation: [member.membershipInfo?.politicOrganisation || '', [Validators.required]],
        bourse: [member.bourse?.bourseId],
        commission: [member.commissions?.[0]?.id],
        clubs: [member.clubs?.[0]?.id],
      }),
      academicInfo: this.fb.group({
        studiesLevel: [member.academicInfo?.studiesLevel || '', [Validators.required, Validators.minLength(3)]],
        institutionName: [member.academicInfo?.institutionName || '', [Validators.required, Validators.minLength(3)]],
        studiesDomain: [member.academicInfo?.studiesDomain || '', [Validators.required, Validators.minLength(3)]],
      }),
      addressInfo: this.fb.group({
        addressInDakar: [member.addressInfo?.addressInDakar || '', [Validators.required, Validators.minLength(3)]],
        holidayAddress: [member.addressInfo?.holidayAddress || '', [Validators.required, Validators.minLength(3)]],
        addressToCampus: [member.addressInfo?.addressToCampus || '', [Validators.required, Validators.minLength(3)]],
      }),
      contactInfo: this.fb.group({
        numberPhone: [member.contactInfo?.numberPhone || '', [Validators.required, Validators.pattern(/^\+221\d{9}$/)]],
        email: [member.contactInfo?.email || '', [Validators.required, Validators.email]],
        personToCalls: this.fb.array([]),
      }),
    });

    // Initialisation des groupes après avoir défini le `FormGroup`
    this.membershipInfoGroup = this.memberForm.get('membershipInfo') as FormGroup;
    this.academicInfoGroup = this.memberForm.get('academicInfo') as FormGroup;
    this.contactGroup = this.memberForm.get('contactInfo') as FormGroup;
    this.personToCallsArray = this.contactInfo.get('personToCalls') as FormArray;
    this.personalInfoGroup = this.memberForm.get("personalInfo") as FormGroup;
    // Ajouter les personnes à contacter
    member.contactInfo?.personToCalls?.forEach((person) => {
      this.addPersonToCall(person);
    });
  }


  addPersonToCall(person?: any): void {
    if (!this.personToCalls) {
      console.error("personToCalls n'est pas encore initialisé.");
      return;
    }

    const personFormGroup = this.fb.group({
      lastname: [person?.lastname || '', Validators.required],
      firstname: [person?.firstname || '', Validators.required],
      requiredNumberPhone: [
        person?.requiredNumberPhone || '',
        [Validators.required, Validators.pattern(/^\+221\d{9}$/)],
      ],
      optionalNumberPhone: [
        person?.optionalNumberPhone || '',
        Validators.pattern(/^\+221\d{9}$/),
      ],
      relationship: [person?.relationship || '', Validators.required],
    });

    this.personToCalls.push(personFormGroup);
  }


  get personToCalls(): FormArray {
    return this.personToCallsArray
  }

  removePersonToCall(index: number): void {
    this.personToCalls.removeAt(index);
  }

  onPersonalInfoChangeSave() {
    this.member.personalInfo = this.memberForm.get("personalInfo")?.value
    this.updateMember(this.member)
  }

  onMembershipInfoSave() {
    this.member.membershipInfo = this.memberForm.get("membershipInfo")?.value
    this.updateMember(this.member)

  }

  onAcademyInfoSaved() {
    this.member.academicInfo = this.memberForm.get("academicInfo")?.value
    this.updateMember(this.member)
  }

  onContactInfoSaved() {
    this.member.contactInfo = this.memberForm.get("contactInfo")?.value
    this.updateMember(this.member)
  }


  updateMember(member: Profile) {
    this.memberService.updateMember(this.member).subscribe({
      next: resp => {
        this.toaster.success("Modification Réussi")
      }, error: err => {
        this.toaster.error("Une erreur s'est produit")
      }
    })
  }
}

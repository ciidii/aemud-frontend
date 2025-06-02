import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MemberService} from "../../core/member.service";
import {Title} from "@angular/platform-browser";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ToastrService} from "ngx-toastr";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommissionService} from "../../../core/services/commission.service";
import {ClubService} from "../../../core/services/club.service";
import {BourseService} from "../../../core/services/bourse.service";
import {CommissionModel} from "../../../core/models/commission.model";
import {BourseModel} from "../../../core/models/bourse.model";
import {ClubModel} from "../../../core/models/club.model";
import {MemberModel} from "../../../core/models/member.model";
import {SessionModel} from "../../../core/models/session.model"; // Import SessionModel
import {YearOfSessionService} from "../../../core/services/year-of-session.service"; // Import YearOfSessionService

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
  memberForm!: FormGroup; // Main form for member details editing
  reinscriptionForm!: FormGroup; // Form for re-enrollment
  showReenrollmentForm: boolean = false; // Controls visibility of re-enrollment form

  commissions!: Array<CommissionModel>;
  clubs!: Array<ClubModel>;
  bourses!: Array<BourseModel>;
  availableSessions: SessionModel[] = []; // To load available sessions for re-enrollment dropdown
  currentSession!: SessionModel; // To pre-select current session in re-enrollment form

  member: MemberModel = {
    id: "",
    personalInfo: {
      name: "",
      firstname: "",
      nationality: "",
      gender: "",
      birthday: [0, 0, 0], // jour, mois, année
      maritalStatus: ""
    },
    membershipInfo: {
      legacyInstitution: "",
      bacSeries: "",
      bacMention: "",
      yearOfBac: "",
      aemudCourses: "",
      otherCourses: "",
      participatedActivity: "",
      politicOrganisation: ""
    },
    academicInfo: {
      institutionName: "",
      studiesDomain: "",
      studiesLevel: ""
    },
    addressInfo: {
      addressInDakar: "",
      holidayAddress: "",
      addressToCampus: ""
    },
    contactInfo: {
      numberPhone: "",
      email: "",
      personToCalls: [{
        lastname: "",
        firstname: "",
        requiredNumberPhone: "",
        optionalNumberPhone: "",
        relationship: ""
      }]
    },
    bourse: { // Make sure this matches your API response structure for bourse
      bourseId: "",
      lebelle: "",
      montant: 0
    },
    clubs: [{
      id: "",
      name: ""
    }],
    commissions: [{
      id: "",
      name: ""
    }],
    registration: [] // Initialize as an empty array
  };

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


  constructor(
    private router: ActivatedRoute,
    private memberService: MemberService,
    private titleService: Title,
    private toasterService: ToastrService,
    private routeService: Router,
    private fb: FormBuilder,
    private commissionService: CommissionService,
    private clubService: ClubService,
    private bourseService: BourseService,
    private toaster: ToastrService,
    private sessionService: YearOfSessionService // Inject YearOfSessionService
  ) {
  }

  ngOnInit(): void {
    const today = new Date();
    const tenYearsAgo = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
    this.maxDate = tenYearsAgo.toISOString().split('T')[0];

    this.memberID = this.router.snapshot.paramMap.get('member-id');
    this.loadMemberDetails(); // Load member details and initialize main form
    this.loadAdditionalData(); // Load commissions, clubs, bourses
    this.loadSessionsForReenrollment(); // Load sessions for the new re-enrollment form
  }

  loadMemberDetails(): void {
    if (this.memberID) {
      this.memberService.getMemberById(this.memberID).subscribe({
        next: response => {
          if (response.status === "OK") {
            this.member = response.data;
            this.initTitle(this.member);
            this.initMemberForm(this.member); // Initialize main member form
            this.initReenrollmentForm(); // Initialize re-enrollment form
          }
        },
        error: err => {
          this.toaster.error("Une erreur s'est produite lors de la récupération des données du membre.");
          console.error(err);
        }
      });
    }
  }

  loadAdditionalData() {
    this.commissionService.getCommissions().subscribe({
      next: data => {
        if (data.status === "OK" && data.result === "Succeeded") {
          this.commissions = data.data;
        } else {
          this.toaster.error("Une erreur inattendue s'est produite côté serveur (commissions).");
        }
      },
      error: err => {
        this.toaster.error("Une erreur s'est produite lors de la récupération des commissions.");
        console.error(err);
      }
    });

    this.clubService.getClubs().subscribe({
      next: data => {
        if (data.status === "OK" && data.result === "Succeeded") {
          this.clubs = data.data;
        } else {
          this.toaster.error("Une erreur inattendue s'est produite côté serveur (clubs).");
        }
      },
      error: err => {
        this.toaster.error("Une erreur s'est produite lors de la récupération des clubs.");
        console.error(err);
      }
    });

    this.bourseService.getAllBourse().subscribe({
      next: data => {
        if (data.status === "OK" && data.result === "Succeeded") {
          this.bourses = data.data;
        }
      },
      error: err => {
        this.toaster.error("Une erreur s'est produite côté serveur (bourses).");
        console.error(err);
      }
    });
  }

  loadSessionsForReenrollment(): void {
    this.sessionService.getYears().subscribe({
      next: resp => {
        if (resp.result === "Succeeded" && resp.data) {
          this.availableSessions = resp.data;
        }
      },
      error: err => {
        this.toaster.error("Erreur lors du chargement des sessions disponibles.");
        console.error(err);
      }
    });

    this.sessionService.getCurrentYear().subscribe({
      next: resp => {
        if (resp.result === "Succeeded" && resp.data) {
          this.currentSession = resp.data;
          this.reinscriptionForm.get('session')?.setValue(this.currentSession.id); // Pre-select current session
        }
      },
      error: err => {
        this.toaster.error("Erreur lors du chargement de la session actuelle pour réinscription.");
        console.error(err);
      }
    });
  }


  initTitle(member: MemberModel | undefined) {
    if (member?.personalInfo) {
      this.titleService.setTitle(`${member.personalInfo.name} ${member.personalInfo.firstname}`)
    } else {
      this.titleService.setTitle("Membre non trouvé")
    }
  }

  deleteProfile() {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce profil ? Cette action est irréversible.")) {
      this.memberService.deleteMember(this.memberID).subscribe({
        next: resp => {
          this.toasterService.success("Profil supprimé avec succès.");
          this.routeService.navigateByUrl("/members/member/list-members"); // Redirect after deletion
        },
        error: err => {
          this.toasterService.error("Une erreur s'est produite lors de la suppression du profil.");
          console.error(err);
        }
      });
    }
  }

  // --- Main Member Form Getters ---
  get membershipInfo(): FormGroup { return this.membershipInfoGroup; }
  get academicInfo(): FormGroup { return this.academicInfoGroup; }
  get contactInfo(): FormGroup { return this.contactGroup; }
  get personalInfo(): FormGroup { return this.personalInfoGroup; }
  get personToCalls(): FormArray { return this.personToCallsArray; }

  // --- Toggle Edit Modes ---
  toggleEditMembershipInfo(): void { this.isEditingMembershipInfo = !this.isEditingMembershipInfo; }
  toggleEditingAcademicInfo(): void { this.isEditingAcademicInfo = !this.isEditingAcademicInfo; }
  toggleEditingContactInfo(): void { this.isEditingContactInfo = !this.isEditingContactInfo; }
  togglePersonalInfoInfo(): void { this.isPersonalInfoEditing = !this.isPersonalInfoEditing; }


  // --- Main Member Form Initialization ---
  initMemberForm(member: MemberModel) {
    this.memberForm = this.fb.group({
      personalInfo: this.fb.group({
        id: [member.id],
        name: [member.personalInfo?.name || '', [Validators.required, Validators.minLength(2)]],
        firstname: [member.personalInfo?.firstname || '', [Validators.required, Validators.minLength(2)]],
        nationality: [member.personalInfo?.nationality || '', [Validators.required, Validators.minLength(2)]],
        birthday: [this.formatDateForInput(member.personalInfo?.birthday), [Validators.required]],
        maritalStatus: [member.personalInfo?.maritalStatus || '', [Validators.required]],
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
        bourse: [member.bourse?.bourseId || null, Validators.required], // Added Validators.required
        commission: [member.commissions?.[0]?.id || null, Validators.required], // Added Validators.required
        clubs: [member.clubs?.[0]?.id || null, Validators.required], // Added Validators.required
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
        numberPhone: [member.contactInfo?.numberPhone?.replace('+221', '') || '', [Validators.required, Validators.pattern(/^\d{9}$/)]],
        email: [member.contactInfo?.email || '', [Validators.required, Validators.email]],
        personToCalls: this.fb.array([]),
      }),
    });

    this.membershipInfoGroup = this.memberForm.get('membershipInfo') as FormGroup;
    this.academicInfoGroup = this.memberForm.get('academicInfo') as FormGroup;
    this.contactGroup = this.memberForm.get('contactInfo') as FormGroup;
    this.personToCallsArray = this.contactInfo.get('personToCalls') as FormArray;
    this.personalInfoGroup = this.memberForm.get("personalInfo") as FormGroup;

    member.contactInfo?.personToCalls?.forEach((person) => {
      this.addPersonToCall(person);
    });
  }

  // Helper function to format birthday for input type="date"
  private formatDateForInput(dateArray: number[] | undefined): string {
    if (!dateArray || dateArray.length !== 3) {
      return '';
    }
    const [year, month, day] = dateArray;
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDay = day < 10 ? '0' + day : day;
    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  addPersonToCall(person?: any): void {
    const personFormGroup = this.fb.group({
      lastname: [person?.lastname || '', Validators.required],
      firstname: [person?.firstname || '', Validators.required],
      requiredNumberPhone: [
        person?.requiredNumberPhone?.replace('+221', '') || '',
        [Validators.required, Validators.pattern(/^\d{9}$/)],
      ],
      optionalNumberPhone: [
        person?.optionalNumberPhone?.replace('+221', '') || '',
        Validators.pattern(/^\d{9}$/),
      ],
      relationship: [person?.relationship || '', Validators.required],
    });
    this.personToCalls.push(personFormGroup);
  }

  removePersonToCall(index: number): void {
    this.personToCalls.removeAt(index);
  }

  // --- Main Member Form Save Methods ---
  onPersonalInfoChangeSave() {
    if (this.personalInfo.valid && this.personalInfo.dirty) {
      const birthdayString = this.personalInfo.get('birthday')?.value;
      if (birthdayString) {
        const [year, month, day] = birthdayString.split('-').map(Number);
        this.member.personalInfo.birthday = [year, month, day];
      }
      this.member.personalInfo = { ...this.member.personalInfo, ...this.personalInfo.value };
      this.updateMember(this.member);
      this.togglePersonalInfoInfo();
    } else {
      this.personalInfo.markAllAsTouched();
      this.toaster.warning("Veuillez corriger les erreurs dans les informations personnelles.");
    }
  }

  onMembershipInfoSave() {
    if (this.membershipInfo.valid && this.membershipInfo.dirty) {
      this.member.membershipInfo = { ...this.member.membershipInfo, ...this.membershipInfo.value };
      if (this.membershipInfo.get('bourse')?.value) {
        const selectedBourse = this.bourses.find(b => b.bourseId === this.membershipInfo.get('bourse')?.value);
        if (selectedBourse) {
          // @ts-ignore
          this.member.bourse = selectedBourse;
        }
      }
      if (this.membershipInfo.get('commission')?.value) {
        const selectedCommission = this.commissions.find(c => c.id === this.membershipInfo.get('commission')?.value);
        if (selectedCommission) {
          // @ts-ignore
          this.member.commissions = [selectedCommission];
        }
      }
      if (this.membershipInfo.get('clubs')?.value) {
        const selectedClub = this.clubs.find(c => c.id === this.membershipInfo.get('clubs')?.value);
        if (selectedClub) {
          // @ts-ignore
          this.member.clubs = [selectedClub];
        }
      }

      this.updateMember(this.member);
      this.toggleEditMembershipInfo();
    } else {
      this.membershipInfo.markAllAsTouched();
      this.toaster.warning("Veuillez corriger les erreurs dans les informations d'adhésion.");
    }
  }

  onAcademyInfoSaved() {
    if (this.academicInfo.valid && this.academicInfo.dirty) {
      this.member.academicInfo = { ...this.member.academicInfo, ...this.academicInfo.value };
      this.updateMember(this.member);
      this.toggleEditingAcademicInfo();
    } else {
      this.academicInfo.markAllAsTouched();
      this.toaster.warning("Veuillez corriger les erreurs dans les informations académiques.");
    }
  }

  onContactInfoSaved() {
    if (this.contactInfo.valid && this.contactInfo.dirty) {
      const contactInfoValue = this.contactInfo.value;

      if (contactInfoValue.numberPhone) {
        contactInfoValue.numberPhone = '+221' + contactInfoValue.numberPhone;
      }
      if (contactInfoValue.personToCalls && contactInfoValue.personToCalls.length > 0) {
        contactInfoValue.personToCalls = contactInfoValue.personToCalls.map((person: any) => ({
          ...person,
          requiredNumberPhone: person.requiredNumberPhone ? '+221' + person.requiredNumberPhone : '',
          optionalNumberPhone: person.optionalNumberPhone ? '+221' + person.optionalNumberPhone : ''
        }));
      }

      this.member.contactInfo = { ...this.member.contactInfo, ...contactInfoValue };
      this.updateMember(this.member);
      this.toggleEditingContactInfo();
    } else {
      this.contactInfo.markAllAsTouched();
      this.toaster.warning("Veuillez corriger les erreurs dans les informations de contact.");
    }
  }

  updateMember(member: MemberModel) {
    this.memberService.updateMember(member).subscribe({
      next: resp => {
        this.toaster.success("Modification Réussie");
        // Reload member details to update all displayed info, including registrations
        this.loadMemberDetails();
      },
      error: err => {
        this.toaster.error("Une erreur s'est produite lors de la modification.");
        console.error(err);
      }
    });
  }

  // --- Re-enrollment Form Logic ---
  initReenrollmentForm(): void {
    this.reinscriptionForm = this.fb.group({
      // `member` property will hold the member's ID
      member: [this.member.id, Validators.required],
      session: [this.currentSession?.id || null, Validators.required],
      registrationType: ['REINSCRIPTION', Validators.required], // Default to REINSCRIPTION
      statusPayment: [false, Validators.required],
      registrationStatus: ['VALID', Validators.required] // Default status
    });
    // Set default session if currentSession is already loaded
    if (this.currentSession) {
      this.reinscriptionForm.get('session')?.setValue(this.currentSession.id);
    }
  }

  toggleReenrollmentForm(): void {
    this.showReenrollmentForm = !this.showReenrollmentForm;
    if (this.showReenrollmentForm) {
      // Reset form and pre-fill current member ID and current session if showing
      this.reinscriptionForm.reset({
        member: this.member.id,
        session: this.currentSession?.id || null,
        registrationType: 'REINSCRIPTION',
        statusPayment: false,
        registrationStatus: 'VALID'
      });
    }
  }

  cancelReenrollment(): void {
    this.showReenrollmentForm = false;
    this.reinscriptionForm.reset();
  }

  onReEnrollSubmit(): void {
    this.reinscriptionForm.markAllAsTouched(); // Show validation errors
    if (this.reinscriptionForm.valid) {
      const registrationData = {
        member: this.member.id, // Ensure the member ID is always set from the current profile
        session: this.reinscriptionForm.get('session')?.value,
        registrationType: this.reinscriptionForm.get('registrationType')?.value,
        statusPayment: this.reinscriptionForm.get('statusPayment')?.value,
        registrationStatus: this.reinscriptionForm.get('registrationStatus')?.value,
      };

      this.memberService.register(registrationData).subscribe({
        next: resp => {
          this.toaster.success("Réinscription enregistrée avec succès !");
          this.showReenrollmentForm = false; // Hide form after success
          this.reinscriptionForm.reset(); // Reset form state
          this.loadMemberDetails(); // Reload member to refresh registrations tab
        },
        error: err => {
          if (err.error && err.error.error && err.error.error.code) {
            if (err.error.error.code === 'MEMBER_ALL_READY_REGISTERED') {
              this.toaster.info("Ce membre est déjà réinscrit pour la session sélectionnée.");
            } else if (err.error.error.code === "ENTITY_NOT_FOUND") {
              this.toaster.error("Erreur: Session introuvable.");
            } else {
              this.toaster.error("Une erreur inattendue est survenue lors de la réinscription.");
            }
          } else {
            this.toaster.error("Une erreur est survenue lors de la réinscription.");
          }
          console.error(err);
        }
      });
    } else {
      this.toaster.warning("Veuillez remplir correctement tous les champs obligatoires du formulaire.");
    }
  }

}

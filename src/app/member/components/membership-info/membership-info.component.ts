import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StepperDataService} from "../../../core/services/stepper-data.service";
import {YearOfSessionServiceService} from "../../../core/services/session/year-of-session-service.service";
import {YearOfSessionResponse} from "../../../core/models/session/YearOfSessionResponse";
import {ToastrService} from "ngx-toastr";
import {Commission} from "../../../core/models/Commission/Commission";
import {CommissionService} from "../../../core/services/commission/commission.service";
import {Clubs} from "../../../core/models/clubs/Clubs";
import {ClubService} from "../../../core/services/clubs/club.service";
import {BourseService} from "../../../core/services/Bourse/bourse.service";
import {BourseModel} from "../../../core/models/bourses/bourse.model";

@Component({
  selector: 'app-membership-info',
  templateUrl: './membership-info.component.html',
  styleUrls: ['./membership-info.component.css']
})
export class MembershipInfoComponent implements OnInit {
  @Output() membershipFormEmitter = new EventEmitter<FormGroup>();
  membershipFormGroup!: FormGroup;
  session!: YearOfSessionResponse;
  commissions!: Array<Commission>
  clubs!: Array<Clubs>
  bourses!: Array<BourseModel>

  constructor(
    private _formBuilder: FormBuilder,
    private stepperDataService: StepperDataService,
    private yearOfSessionService: YearOfSessionServiceService,
    private toaster: ToastrService,
    private commissionService: CommissionService,
    private clubService: ClubService,
    private bourseService: BourseService
  ) {
  }

  ngOnInit() {
    this.yearOfSessionService.getCurrentYear().subscribe({

      next: data => {
        if (data.status == "OK" && data.result == "Succeeded") {
          this.session = data.data;
          console.log(data.data.id)
        } else {
          this.toaster.error("Une erreurs inattendu c'est produit côte server")
        }
      },
      error: err => {
        this.toaster.error("Une erreur inattendu c'est produite côté server")
      }
    });

    this.membershipFormGroup = this._formBuilder.group({
      yearOfMembership: [{value: this.session?.id, disabled: true}, [Validators.required, Validators.min(1)]],
      yearOfBac: ['', [Validators.required, Validators.minLength(3)]],
      bacSeries: ['', [Validators.required, Validators.minLength(2)]],
      bacMention: ['', [Validators.required, Validators.minLength(3)]],
      legacyInstitution: ['', [Validators.required, Validators.minLength(3)]],
      pay: ['', [Validators.required, Validators.minLength(1)]],
      aemudCourses: ['', [Validators.required]],
      otherCourses: ['', [Validators.required, Validators.minLength(5)]],
      participatedActivity: ['', [Validators.required]],
      politicOrganisation: ['', [Validators.required]],
      commission: ['', [Validators.required, Validators.min(1)]],
      clubs: ['', [Validators.required, Validators.min(1)]],
      bourse: ['', [Validators.required, Validators.min(1)]]

    });

    this.commissionService.getCommissions().subscribe({
      next: data => {
        if (data.status == "OK" && data.result == "Succeeded") {
          this.commissions = data.data;
        } else {
          this.toaster.error("Une erreurs inattendu c'est produit côte server")
        }
      },
      error: err => {
        this.toaster.error("Une erreur c'est produit lors de la récupation des données")
      }
    });
    this.clubService.getClubs().subscribe({
      next: data => {
        if (data.status == "OK" && data.result == "Succeeded") {
          this.clubs = data.data
        } else {
          this.toaster.error("Une erreur c'est produite du côté server")
        }
      },
      error: err => {
        this.toaster.error("Une erreur c'est produite du côté server")
      }
    });
    this.bourseService.getAllBourse().subscribe({
      next: data => {
        if (data.status == "OK" && data.result == "Succeeded") {
          this.bourses = data.data;
        }
      }, error: err => {
        this.toaster.error("Une erreur c'est produite du côté server")
      }
    })


    const savedData = this.stepperDataService.getStepData(2);
    if (savedData) {
      this.membershipFormGroup.patchValue(savedData);
    }


  }
  checkInvalidControls(formGroup:FormGroup) {
    const invalid = [];
    const controls = formGroup.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        console.log(`Le champ ${name} est invalide :`, controls[name].errors);
      }
    }

    return invalid;
  }

  onSave() {
    this.membershipFormEmitter.emit(this.membershipFormGroup)
  }

  /*

   */
}

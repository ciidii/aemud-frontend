import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {StepperDataService} from "../../../core/services/stepper-data.service";
import {ToastrService} from "ngx-toastr";
import {CommissionModel} from "../../../core/models/commission.model";
import {CommissionService} from "../../../core/services/commission.service";
import {ClubModel} from "../../../core/models/club.model";
import {ClubService} from "../../../core/services/club.service";
import {BourseService} from "../../../core/services/bourse.service";
import {UtilsService} from "../../../core/services/utils.service";
import {NgClass, NgFor, NgIf} from '@angular/common';
import {BourseModel} from "../../../core/models/bourse.model";

@Component({
  selector: 'app-info-membership',
  templateUrl: './membership-info.component.html',
  styleUrls: ['./membership-info.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf, NgFor]
})
export class MembershipInfoComponent implements OnInit {
  @Output() membershipFormEmitter = new EventEmitter<FormGroup>();
  membershipFormGroup!: FormGroup;
  commissions!: Array<CommissionModel>
  clubs!: Array<ClubModel>
  bourses!: Array<BourseModel>

  constructor(
    private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private commissionService: CommissionService,
    private clubService: ClubService,
    private bourseService: BourseService,
    private utilsService: UtilsService,
    protected stepperService: StepperDataService
  ) {
  }

  ngOnInit() {
    const local = localStorage.getItem("membershipInfo");
    var membershipInfoLocalStorage;
    if (local) {
      membershipInfoLocalStorage = JSON.parse(local)
    }
    this.membershipFormGroup = this._formBuilder.group({
      yearOfBac: [membershipInfoLocalStorage?.yearOfBac || '', [Validators.required, Validators.minLength(3)]],
      bacSeries: [membershipInfoLocalStorage?.bacSeries || '', [Validators.required, Validators.minLength(2)]],
      bacMention: [membershipInfoLocalStorage?.bacMention || '', [Validators.required, Validators.minLength(3)]],
      legacyInstitution: [membershipInfoLocalStorage?.legacyInstitution || '', [Validators.required, Validators.minLength(3)]],
      aemudCourses: [membershipInfoLocalStorage?.aemudCourses || '', [Validators.required]],
      otherCourses: [membershipInfoLocalStorage?.otherCourses || '', [Validators.required, Validators.minLength(5)]],
      participatedActivity: [membershipInfoLocalStorage?.participatedActivity || '', [Validators.required]],
      politicOrganisation: [membershipInfoLocalStorage?.politicOrganisation || '', [Validators.required]],
      commission: [membershipInfoLocalStorage?.commission || '', [Validators.required, Validators.min(1)]],
      clubs: [membershipInfoLocalStorage?.clubs || null, [Validators.required, Validators.min(1)]],
      bourse: [membershipInfoLocalStorage?.bourse || '', [Validators.required, Validators.min(1)]]
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
    this.toggleMembershipInfo();
  }

  onSave() {
    this.membershipFormEmitter.emit(this.membershipFormGroup)
    this.toggleMembershipInfo();
  }

  toggleMembershipInfo() {
    this.utilsService.togglePersonalInfoSaved(this.membershipFormGroup, this.stepperService.membershipInfoSaved);
  }

  onModify() {
    this.stepperService.changeMemberInfoState()
    this.toggleMembershipInfo()
  }
}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MemberService} from "../../../core/services/member.service";
import {ClubModel} from "../../model/club.model";
import {CommissionModel} from "../../model/commission.model";
import {BourseModel} from "../../../core/models/bourses/bourse.model";
import {BourseService} from "../../../core/services/Bourse/bourse.service";
import {YearOfMembeship} from "../../../core/models/yearOfMembeship";
import {MemberModel} from "../../model/member.model";
import {ToastrService} from "ngx-toastr";
import {CommissionService} from "../../../core/services/commission/commission.service";
import {NgFor, NgIf} from '@angular/common';

@Component({
    selector: 'app-edit-member',
    templateUrl: './edit-member.component.html',
    styleUrls: ['./edit-member.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf]
})
export class EditMemberComponent implements OnInit {
  memberGroup!: FormGroup;
  clubs!: ClubModel[];
  commissions!: CommissionModel[];
  bourses!: BourseModel[];
  memberId!: number;
  aemudActivities!: any
  aemudCourses!: any;
  otherCourses!: any;
  politicalOrganisation!: any;
  memberModel!: any;

  constructor(private formBuilder: FormBuilder,
              private memberService: MemberService,
              private router: Router,
              private activeRouter: ActivatedRoute,
              private commissionService: CommissionService,
              private bourseService: BourseService,
              private toaster: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.memberGroup = this.createForm();
    this.getClubsFromDb();
    this.getCommissionFromDb();
    this.bourseService.getAllBourse().subscribe({
      next: response => {
        if (response.status == "OK" && response.result == "Succeeded") {
          this.bourses = response.data;
          console.log(this.bourses)
        } else {
          console.log("Failed to fetch data", response.error);
        }
      }, error: err => {
        console.log("Error fetching data", err)
      }
    });

    this.aemudActivities = [{value: "no", id: "activezAEMUDNon", label: "Non"}, {
      value: "yes",
      id: "activezAEMUDOui",
      label: "Oui"
    },];
    this.aemudCourses = [{value: "no", id: "coursIslamiqueAEMUDNon", label: "Non"}, {
      value: "yes",
      id: "coursIslamiqueAEMUDOui",
      label: "Oui"
    },];
    this.otherCourses = [{value: "no", id: "autreCoursIslamiqueNon", label: "Non"}, {
      value: "yes",
      id: "autreCoursIslamiqueOui",
      label: "Oui"
    },];
    this.politicalOrganisation = [{value: "no", id: "organisationPolitiqueNon", label: "Non"}, {
      value: "yes",
      id: "organisationPolitiqueOui",
      label: "Oui"
    },];
    this.memberId = this.activeRouter.snapshot.params['id'];
    this.putDataFromDbOnForm()
  }

  public saveChangers() {
    let memberChange = this.bindMember();
    this.memberService.updateMember(memberChange).subscribe(
      {
        next: member => {
          this.toaster.success("Les modifications enregistrer")
          this.router.navigateByUrl(`welcome/member`).then(r => true)
        },
        error: err => {
          this.toaster.error("Une erreur c'est produite")
          console.log(err)
        }
      }
    )
  }

  private bindMember() {
    let clubs: ClubModel[];
    let club = new ClubModel();
    let commission = new CommissionModel();
    let yearOfMemberShip = new YearOfMembeship();
    let bourse = new BourseModel();
    this.memberModel = new MemberModel();
    this.memberModel.id = this.memberId;
    this.memberModel.name = this.memberGroup.get("name")?.value;
    this.memberModel.firstname = this.memberGroup.get("firstname")?.value;
    this.memberModel.nationality = this.memberGroup.get("nationality")?.value;
    this.memberModel.birthday = this.memberGroup.get("birthday")?.value;
    this.memberModel.maritalStatus = this.memberGroup.get("maritalStatus")?.value;
    this.memberModel.addressInDakar = this.memberGroup.get("addressInDakar")?.value;
    this.memberModel.addressToCampus = this.memberGroup.get("addressToCampus")?.value;
    this.memberModel.holidayAddress = this.memberGroup.get("holidayAddress")?.value;
    this.memberModel.numberPhone = this.memberGroup.get("numberPhone")?.value;
    this.memberModel.email = this.memberGroup.get("email")?.value;
    this.memberModel.personToCall = this.memberGroup.get("personToCall")?.value;
    this.memberModel.faculty = this.memberGroup.get("faculty")?.value;
    this.memberModel.departmentOrYear = this.memberGroup.get("departmentOrYear")?.value;
    this.memberModel.participatedActivity = this.memberGroup.get("participatedActivity")?.value;
    this.memberModel.aemudCourseParticipated = this.memberGroup.get("aemudCourseParticipated")?.value;
    this.memberModel.otherCourseParticipated = this.memberGroup.get("otherCourseParticipated")?.value;
    this.memberModel.politicOrganisation = this.memberGroup.get("politicOrganisation")?.value;
    this.memberModel.yearOfMembership = this.memberGroup.get("yearOfMembership")?.value;
    this.memberModel.twinsName = this.memberGroup.get("twinsName")?.value;
    this.memberModel.pay = this.memberGroup.get("pay")?.value;
    club.id = this.memberGroup.get("club")?.value
    commission.id = this.memberGroup.get("commission")?.value;
    bourse.bourseId = this.memberGroup.get("bourse")?.value;
    yearOfMemberShip.idYear = 1;
    clubs = new Array(club);
    this.memberModel.clubs = clubs;
    this.memberModel.commission = commission;
    this.memberModel.yearOfMembership = yearOfMemberShip;
    this.memberModel.bourse = bourse;
    return this.memberModel;

  }

  private createForm() {
    return this.formBuilder.group({
      name: this.formBuilder.control(''),
      firstname: this.formBuilder.control(''),
      nationality: this.formBuilder.control(''),
      birthday: this.formBuilder.control(''),
      maritalStatus: this.formBuilder.control('none'),
      addressInDakar: this.formBuilder.control(''),
      addressToCampus: this.formBuilder.control(''),
      holidayAddress: this.formBuilder.control(''),
      numberPhone: this.formBuilder.control(''),
      email: this.formBuilder.control(''),
      personToCall: this.formBuilder.control(''),
      faculty: this.formBuilder.control(''),
      departmentOrYear: this.formBuilder.control(''),
      bourse: this.formBuilder.control(''),
      doYouParticipateAemudActivity: this.formBuilder.control('no'),
      participatedActivity: this.formBuilder.control(''),
      doYouParticipateAemudCourse: this.formBuilder.control('no'),
      aemudCourseParticipated: this.formBuilder.control(''),
      doYouParticipatedOtherCourse: this.formBuilder.control('no'),
      otherCourseParticipated: this.formBuilder.control(''),
      areYouMemberOfPoliticOrganisation: this.formBuilder.control('no'),
      politicOrganisation: this.formBuilder.control(''),
      yearOfMembership: this.formBuilder.control(''),
      twinsName: this.formBuilder.control(''),
      commission: this.formBuilder.control('none'),
      club: this.formBuilder.control('none'),
      pay: this.formBuilder.control('no'),


    });
  }

  private getClubsFromDb() {
  }

  private getCommissionFromDb() {
    this.commissionService.getCommissions().subscribe({
      next: response => {
        if (response.status == "OK" && response.result == "Succeeded") {
          this.commissions = response.data;
        } else {
          console.log("Failed to fetch data", response.error);
        }
      },
      error: err => {
        console.log("Error fetching data", err)
      }
    });
  }

  private putDataFromDbOnForm() {
    this.memberService.getMemberById(this.memberId)
      .subscribe(
        {
          next: member => {
            if (member.result == "Succeeded" && member.status == "OK") {
              if (this.memberGroup.value.participatedActivity != null) {
              }
            } else {
              this.memberGroup = this.formBuilder.group({});
              console.log("Error while fetching data-----------------------------------------------------------" + member.error)
            }
          },
          error: err => {
            console.log(err)
          }
        });
  }
}

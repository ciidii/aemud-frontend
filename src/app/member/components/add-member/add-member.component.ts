import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MemberService} from "../../service/member.service";
import {Router} from "@angular/router";
import {ClubModel} from "../../model/club.model";
import {BourseService} from "../../service/bourse.service";
import {ResponseEntityApi} from "../../../core/model/responseEntityApi";
import {CommissionService} from "../../service/commission.service";
import {CommissionModel} from "../../model/commission.model";
import {BourseModel} from "../../model/bourse.model";
import {ClubService} from "../../service/club.service";
import {MemberModel} from "../../model/member.model";
import {YearOfMembeship} from "../../../core/model/yearOfMembeship";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {
  memberGroup!: FormGroup;
  clubs!: ClubModel[];
  commissions!: CommissionModel[];
  bourses!: BourseModel[];
  aemudActivities!: any
  aemudCourses!: any;
  otherCourses!: any;
  politicalOrganisation!: any;
  memberModel!: any;

  constructor(
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private router: Router,
    private bourseService: BourseService,
    private commissionService: CommissionService,
    private clubService: ClubService,
    private toaster: ToastrService
  ) {
  }

  ngOnInit(): void {
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
    this.clubService.getAllClubs().subscribe(
      (response: ResponseEntityApi<ClubModel[]>) => {
        if (response.status === 'OK' && response.result === 'Succeeded') {
          this.clubs = response.data;
        } else {
          console.error('Failed to fetch data', response.error);
        }
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
    this.commissionService.getAllCommission().subscribe({
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


    this.memberGroup = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      firstname: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      nationality: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      birthday: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      maritalStatus: this.formBuilder.control('none', [Validators.required]),
      addressInDakar: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      addressToCampus: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      holidayAddress: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      numberPhone: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      email: this.formBuilder.control('', [Validators.email, Validators.minLength(3), Validators.maxLength(100)]),
      personToCall: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      faculty: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      departmentOrYear: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      bourse: this.formBuilder.control('', [Validators.required]),
      doYouParticipateAemudActivity: this.formBuilder.control('no', [Validators.required]),
      participatedActivity: this.formBuilder.control(''),
      doYouParticipateAemudCourse: this.formBuilder.control('no', [Validators.required]),
      aemudCourseParticipated: this.formBuilder.control(''),
      doYouParticipatedOtherCourse: this.formBuilder.control('no', [Validators.required]),
      otherCourseParticipated: this.formBuilder.control(''),
      areYouMemberOfPoliticOrganisation: this.formBuilder.control('no', [Validators.required]),
      politicOrganisation: this.formBuilder.control(''),
      yearOfMembership: this.formBuilder.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
      twinsName: this.formBuilder.control(''),
      commission: this.formBuilder.control('none', [Validators.required]),
      club: this.formBuilder.control('none'),
      pay: this.formBuilder.control('no', [Validators.required]),

    })

  }

  public saveUser() {
    let member = this.bindMember();
    console.log(member);
    this.memberService.addMember(member).subscribe({
      next: response => {
          this.toaster.success("L'ajout a reussi");
          this.router.navigateByUrl("welcome/member")
      }, error: err => {
          this.toaster.error("Une erreur s'est produite")
      }
    })

  }

  private bindMember() {
    let clubs: ClubModel[];
    let club = new ClubModel();
    let commission = new CommissionModel();
    let yearOfMemberShip = new YearOfMembeship();
    let bourse = new BourseModel();
    this.memberModel = new MemberModel();
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
}

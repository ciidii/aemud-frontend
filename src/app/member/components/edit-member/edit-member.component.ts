import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MemberService} from "../../services/member.service";
import {ClubModel} from "../../model/club.model";
import {CommissionModel} from "../../model/commission.model";
import {BourseModel} from "../../model/bourse.model";
import {ResponseEntityApi} from "../../../core/model/responseEntityApi";
import {BourseService} from "../../services/bourse.service";
import {ClubService} from "../../services/club.service";
import {CommissionService} from "../../services/commission.service";
import {YearOfMembeship} from "../../../core/model/yearOfMembeship";
import {MemberModel} from "../../model/member.model";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.css']
})
export class EditMemberComponent implements OnInit {
  memberGroup!: FormGroup;
  clubs!: ClubModel[];
  commissions!: CommissionModel[];
  bourses!:BourseModel[];
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
              private clubService:ClubService,
              private commissionService: CommissionService,
              private bourseService: BourseService,
              private toaster:ToastrService
  ) {
  }

  ngOnInit(): void {
    this.memberGroup = this.createForm();
    this.getClubsFromDb();
    this.getCommissionFromDb();
    this.bourseService.getAllBourse().subscribe({next: response=>{
        if (response.status=="OK" && response.result=="Succeeded"){
          this.bourses = response.data;
          console.log(this.bourses)
        }else {
          console.log("Failed to fetch data", response.error);
        }
      },error:err => {
        console.log("Error fetching data", err)}});

    this.aemudActivities = [{value:"no",id:"activezAEMUDNon", label:"Non"}, {value:"yes",id:"activezAEMUDOui",label:"Oui"},];
    this.aemudCourses = [{value:"no",id:"coursIslamiqueAEMUDNon", label:"Non"}, {value:"yes",id:"coursIslamiqueAEMUDOui",label:"Oui"},];
    this.otherCourses = [{value:"no",id:"autreCoursIslamiqueNon", label:"Non"}, {value:"yes",id:"autreCoursIslamiqueOui",label:"Oui"},];
    this.politicalOrganisation = [{value:"no",id:"organisationPolitiqueNon", label:"Non"}, {value:"yes",id:"organisationPolitiqueOui",label:"Oui"},];
    this.memberId = this.activeRouter.snapshot.params['id'];
    this.putDataFromDbOnForm()
  }

  public saveChangers() {
    let memberChange = this.bindMember();
    this.memberService.updateMember(memberChange).subscribe(
      {
        next: member => {
          this.toaster.success("Les modifications enregistrer")
          this.router.navigateByUrl(`welcome/member`)
        },
        error: err => {
          this.toaster.error("Une erreur c'est produite")
          console.log(err)
        }
      }
    )
  }
  private bindMember(){
    let clubs: ClubModel[];
    let club = new ClubModel();
    let commission =  new CommissionModel();
    let yearOfMemberShip = new YearOfMembeship();
    let bourse = new BourseModel();
    this.memberModel = new MemberModel();
    this.memberModel.id=this.memberId;
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
    bourse.bourseId =  this.memberGroup.get("bourse")?.value;
    yearOfMemberShip.idYear = 1;
    clubs =  new Array(club);
    this.memberModel.clubs = clubs;
    this.memberModel.commission = commission;
    this.memberModel.yearOfMembership = yearOfMemberShip;
    this.memberModel.bourse = bourse;
    return this.memberModel;

  }
  private createForm(){
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
  private getClubsFromDb(){
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
  }
  private getCommissionFromDb(){
    this.commissionService.getAllCommission().subscribe({
      next:response=>{
        if (response.status=="OK" && response.result=="Succeeded"){
          this.commissions = response.data;
        }else {
          console.log("Failed to fetch data", response.error);
        }
      },
      error:err => {
        console.log("Error fetching data", err)
      }
    });
  }

  private putDataFromDbOnForm(){
    this.memberService.getMemberById(this.memberId)
      .subscribe(
        {
          next: member => {
            if (member.result=="Succeeded" && member.status=="OK"){
              this.memberGroup = this.formBuilder.group({
                id: this.formBuilder.control(this.memberId),
                name: this.formBuilder.control(member?.data?.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
                firstname: this.formBuilder.control(member.data.firstname, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
                nationality: this.formBuilder.control(member.data.nationality, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
                birthday: this.formBuilder.control(member.data.birthday, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
                maritalStatus: this.formBuilder.control(member.data.maritalStatus, [Validators.required]),
                addressInDakar: this.formBuilder.control(member.data.addressInDakar, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
                addressToCampus: this.formBuilder.control(member.data.addressToCampus, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
                holidayAddress: this.formBuilder.control(member.data.holidayAddress, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
                numberPhone: this.formBuilder.control(member.data.numberPhone, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
                email: this.formBuilder.control(member.data.email, [Validators.email, Validators.minLength(3), Validators.maxLength(100)]),
                personToCall: this.formBuilder.control(member.data.personToCall, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
                faculty: this.formBuilder.control(member.data.faculty, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
                departmentOrYear: this.formBuilder.control(member.data.departmentOrYear, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
                bourse: this.formBuilder.control(member.data.bourse, [Validators.required]),
                doYouParticipateAemudActivity: this.formBuilder.control(member.data.participatedActivity==null?'no':'yes', [Validators.required]),
                participatedActivity: this.formBuilder.control(member.data.participatedActivity),
                doYouParticipateAemudCourse: this.formBuilder.control(member.data.doYouParticipateAemudCourse==null?'no':'yes', [Validators.required]),
                aemudCourseParticipated: this.formBuilder.control(member.data.aemudCourseParticipated),
                doYouParticipatedOtherCourse: this.formBuilder.control(member.data.doYouParticipatedOtherCourse==null?'no':'yes', [Validators.required]),
                otherCourseParticipated: this.formBuilder.control(member.data.otherCourseParticipated),
                areYouMemberOfPoliticOrganisation: this.formBuilder.control(member.data.areYouMemberOfPoliticOrganisation==null?'no':'yes', [Validators.required]),
                politicOrganisation: this.formBuilder.control(member.data.politicOrganisation),
                yearOfMembership: this.formBuilder.control(member.data.yearOfMembership.year_, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
                twinsName: this.formBuilder.control(member.data.twinsName),
                commission: this.formBuilder.control(member.data.commission.id, [Validators.required]),
                club: this.formBuilder.control(member.data.clubs?.at(0)?.id),
                pay: this.formBuilder.control(member.data.pay, [Validators.required]),

              });
              if (this.memberGroup.value.participatedActivity!=null){
              }
            }else {
              this.memberGroup = this.formBuilder.group({});
              console.log("Error while fetching data-----------------------------------------------------------"+member.error)
            }
          },
          error: err => {
            console.log(err)
          }
        });
  }
}

import {Injectable} from '@angular/core';
import {UtilsService} from "./utils.service";
import {FormGroup} from "@angular/forms";


@Injectable({
  providedIn: 'root'
})
export class StepperDataService {
  private _personalInfoSaved: boolean = false;
  private _membershipInfoSaved: boolean = false;
  private _academicInfoSaved: boolean = false;
  private _addressInfoSaved: boolean = false;
  private _contactInfoSaved: boolean = false;

  formData: any = {
    id: null,
    personalInfo: {
      name: "",
      firstname: "",
      nationality: "",
      birthday: "",
      maritalStatus: ""
    },
    membershipInfo: {
      yearOfBac: "",
      bacSeries: "",
      bacMention: "",
      legacyInstitution: "",
      aemudCourses: "",
      otherCourses: "",
      participatedActivity: "",
      politicOrganisation: "",
      commission: [],
      clubs: [],
      bourse: "",

    },
    academicInfo: {},
    addressInfo: {},
    contactInfo: {},
    bourseId: {bourseId: {}},
    clubsId: [{id: {}}],
    commissionsId: [{id: {}}]
  };

  constructor(private utilsService: UtilsService) {
  }

  formatMemberFormData(formGroup: FormGroup) {
    let formRequest = {
      id: null,
      personalInfo: {
        name: "",
        firstname: "",
        nationality: "",
        birthday: "",
        maritalStatus: ""
      },
      membershipInfo: {
        yearOfBac: "",
        bacSeries: "",
        bacMention: "",
        legacyInstitution: "",
        aemudCourses: "",
        otherCourses: "",
        participatedActivity: "",
        politicOrganisation: "",
        commission: [],
        clubs: [],
        bourse: "",

      },
      academicInfo: {},
      addressInfo: {},
      contactInfo: {},
      bourseId: {bourseId: {}},
      clubsId: [{id: {}}],
      commissionsId: [{id: {}}]
    };
  }

  setMemberPersonalInfo(data: any) {
    this.formData.personalInfo = data;
    if (this.formData.personalInfo !== null) {
      localStorage.setItem("personalInfo", JSON.stringify(this.formData.personalInfo))
      this._personalInfoSaved = true
    } else {
    }

  }

  setMemberMembershipInfo(data: any) {
    this.formData.membershipInfo = data;
    if (this.formData.membershipInfo !== null) {
      localStorage.setItem("membershipInfo", JSON.stringify(this.formData.membershipInfo))
      this._membershipInfoSaved = true
    } else {
    }
  }

  setMemberBourseInfo(data: any) {
    this.formData.bourseId.bourseId = data;
    localStorage.setItem("bourseId", JSON.stringify(this.formData.membershipInfo))
    this._membershipInfoSaved = true
  }

  setMemberClubsInfo(data: any) {
    this.formData.clubsId[0].id = data;
    localStorage.setItem("clubsId", JSON.stringify(this.formData.membershipInfo))
    this._membershipInfoSaved = true
  }

  setMemberCommissionInfo(data: any) {
    this.formData.commissionsId[0].id = data;
    localStorage.setItem("commissionsId", JSON.stringify(this.formData.membershipInfo))
    this._membershipInfoSaved = true
  }

  setAcademicInfo(data: any) {
    this.formData.academicInfo = data;
    if (this.formData.academicInfo !== null) {
      localStorage.setItem("academicInfo", JSON.stringify(this.formData.academicInfo))
      this._academicInfoSaved = true
    } else {
    }

  }

  setAllFormsUnsaved() {
    this._personalInfoSaved = false;
    this._membershipInfoSaved = false;
    this._academicInfoSaved = false;
    this._addressInfoSaved = false;
    this._contactInfoSaved = false;

  }

  setAddressInfo(data: any) {
    this.formData.addressInfo = data;
    if (this.formData.addressInfo !== null) {
      localStorage.setItem("addressInfo", JSON.stringify(this.formData.addressInfo))
      this.addressInfoSaved = true;
    } else {
    }

  }

  setContactInfo(data: any) {
    this.formData.contactInfo = data;
    if (this.formData.contactInfo !== null) {
      localStorage.setItem("contactInfo", JSON.stringify(this.formData.contactInfo))
      this._contactInfoSaved = true;
    } else {
    }

  }


  get personalInfoSaved(): boolean {
    return this._personalInfoSaved;
  }

  get membershipInfoSaved(): boolean {
    return this._membershipInfoSaved;
  }


  get academicInfoSaved(): boolean {
    return this._academicInfoSaved;
  }


  get addressInfoSaved(): boolean {
    return this._addressInfoSaved;
  }

  set addressInfoSaved(value: boolean) {
    this._addressInfoSaved = value;
  }

  getFormData() {
    return this.formData;
  }

  formatMemberData() {

  }

  getStepData(step: number) {
    return this.formData[step];
  }


  get contactInfoSaved(): boolean {
    return this._contactInfoSaved;
  }

  set contactInfoSaved(value: boolean) {
    this._contactInfoSaved = value;
  }


  clearFormData() {
    this.formData = {};
  }

  changePersonalInfoState() {
    this._personalInfoSaved = false;
  }

  changeAcademicInfoState() {
    this._academicInfoSaved = false
  }

  changeMemberInfoState() {
    this._membershipInfoSaved = false
  }

  changeAddressInfoState() {
    this._addressInfoSaved = false
  }

  changeContactInfoState() {
    this._contactInfoSaved = false
  }
}

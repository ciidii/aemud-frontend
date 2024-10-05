import {Injectable} from '@angular/core';
import {UtilsService} from "./utils.service";

@Injectable({
  providedIn: 'root'
})
export class StepperDataService {
  private _personalInfoSaved: boolean = false;
  private _membershipInfoSaved: boolean = false;
  private _academicInfoSaved: boolean = false;
  private _addressInfoSaved: boolean = false;
  private _contactInfoSaved: boolean = false;

  private formData: any = {
    member: {
      id:null,
      personalInfo: {},
      membershipInfo: {}
    },
    academicInfo: {},
    addressInfo: {},
    contactInfo: {}
  };

  constructor(private utilsService: UtilsService) {
  }

  setMemberPersonalInfo(data: any) {
    this.formData.member.personalInfo = data;
    if (this.formData.member.personalInfo !== null) {
      localStorage.setItem("personalInfo", JSON.stringify(this.formData.member.personalInfo))
      this._personalInfoSaved = true
    } else {
    }

  }

  setMemberMembershipInfo(data: any) {
    this.formData.member.membershipInfo = data;
    if (this.formData.member.membershipInfo !== null) {
      localStorage.setItem("membershipInfo", JSON.stringify(this.formData.member.membershipInfo))
      this._membershipInfoSaved = true
    } else {
    }
  }

  setAcademicInfo(data: any) {
    this.formData.academicInfo = data;
    if (this.formData.academicInfo !== null) {
      localStorage.setItem("academicInfo", JSON.stringify(this.formData.academicInfo))
      this._academicInfoSaved = true
    } else {
    }

  }
  setAllFormsUnsaved(){
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

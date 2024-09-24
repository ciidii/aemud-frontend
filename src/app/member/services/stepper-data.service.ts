import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StepperDataService {

  private formData: any = {
    member: {
      personalInfo: {},
      membershipInfo: {}
    }

  };

  setFormData(step: number, data: any) {
    this.formData[step] = data;
  }

  setMemberPersonalInfo(data: any) {
    this.formData.member.personalInfo = data;
  }

  getFormData() {
    return this.formData;
  }

  getStepData(step: number) {
    return this.formData[step];
  }

  clearFormData() {
    this.formData = {};
  }
}

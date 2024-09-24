import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StepperDataService {

  private formData: any = {};

  setFormData(step: number, data: any) {
    this.formData[step] = data;
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

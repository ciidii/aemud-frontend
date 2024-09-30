import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {StepperDataService} from "../../../core/services/stepper-data.service";

@Component({
  selector: 'app-main-form-step-2',
  templateUrl: './main-form-step-2.component.html',
  styleUrls: ['./main-form-step-2.component.css']
})
export class MainFormStep2Component implements OnInit {
  academicInfoForm!: FormGroup;
  contactInfoForm!: FormGroup;
  addressInfoForm!: FormGroup;
  @Output() previous = new EventEmitter<void>();

  constructor(private stepperService: StepperDataService) {
  }

  ngOnInit(): void {
  }

  onAcademicInfoSubmit(form: FormGroup) {
    this.stepperService.setAcademicInfo(form.value)
  }

  onContactInfoSubmit(form: FormGroup) {
    this.stepperService.setContactInfo(form.value)
  }

  onAddressInfoSubmit(form: FormGroup) {
    this.stepperService.setAddressInfo(form.value)
  }

  onPrevious() {
    this.previous.emit();
  }
}

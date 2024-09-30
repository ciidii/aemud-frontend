import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {StepperDataService} from "../../../core/services/stepper-data.service";

@Component({
  selector: 'app-main-form-step-1',
  templateUrl: './main-form-step-1.component.html',
  styleUrls: ['./main-form-step-1.component.css']
})
export class MainFormStep1Component implements OnInit {
  @Output() next = new EventEmitter<void>();
  constructor(public stepperContentService: StepperDataService) {
  }

  onMembershipInfoSaved(formGroup: FormGroup) {
    this.stepperContentService.setMemberMembershipInfo(formGroup.value)
  }

  onPersonalInfoSaved(personalInfo: FormGroup) {
    this.stepperContentService.setMemberPersonalInfo(personalInfo.value)
  }

  onNext() {
    this.next.emit();
  }

  ngOnInit(): void {
  }
}

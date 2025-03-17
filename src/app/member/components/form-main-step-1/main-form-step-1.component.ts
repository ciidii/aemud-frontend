import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {StepperDataService} from "../../../core/services/stepper-data.service";
import {PersonalInfoComponent} from "../info-personal/personal-info.component";
import {MembershipInfoComponent} from "../info-membership/membership-info.component";

@Component({
  selector: 'app-form-main-step-1',
  templateUrl: './main-form-step-1.component.html',
  styleUrls: ['./main-form-step-1.component.css'],
  standalone: true,
  imports: [PersonalInfoComponent, MembershipInfoComponent]
})
export class MainFormStep1Component implements OnInit {
  @Output() next = new EventEmitter<void>();

  constructor(public stepperContentService: StepperDataService) {
  }

  onMembershipInfoSaved(formGroup: FormGroup) {
    this.stepperContentService.setMemberMembershipInfo(formGroup.value)
    this.stepperContentService.setMemberClubsInfo(formGroup.get("clubs")?.value)
    this.stepperContentService.setMemberCommissionInfo(formGroup.get("commission")?.value)
    this.stepperContentService.setMemberBourseInfo(formGroup.get("bourse")?.value)
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

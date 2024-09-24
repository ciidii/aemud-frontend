import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StepperDataService} from "../../services/stepper-data.service";

@Component({
  selector: 'app-membership-info',
  templateUrl: './membership-info.component.html',
  styleUrls: ['./membership-info.component.css']
})
export class MembershipInfoComponent implements OnInit {
  @Output() membershipFormEmitter = new EventEmitter<FormGroup>();
  membershipFormGroup!: FormGroup;

  constructor(private _formBuilder: FormBuilder, private stepperDataService: StepperDataService) {
  }

  ngOnInit() {
    this.membershipFormGroup = this._formBuilder.group({
      yearOfMembership: ['', [Validators.required, Validators.min(1)]],
      yearOfBac: ['', [Validators.required, Validators.minLength(3)]],
      bacSeries: ['', [Validators.required, Validators.minLength(3)]],
      bacMention: ['', [Validators.required, Validators.minLength(3)]],
      legacyInstitution: ['', [Validators.required, Validators.minLength(3)]],
      pay: ['', [Validators.required, Validators.minLength(5)]],
      aemudCourses: ['', [Validators.required]],
      otherCourses: ['', [Validators.required, Validators.minLength(5)]],
      participatedActivity: ['', [Validators.required]],
      politicOrganisation: ['', [Validators.required]],
      commission: ['', [Validators.required, Validators.min(1)]],
      clubs: ['', [Validators.required, Validators.min(1)]],
      bourse: ['', [Validators.required, Validators.min(1)]]

    })
    ;


    const savedData = this.stepperDataService.getStepData(2);
    if (savedData) {
      this.membershipFormGroup.patchValue(savedData);
    }
  }

  onSave() {
    this.membershipFormEmitter.emit(this.membershipFormGroup)
  }

  /*

   */
}

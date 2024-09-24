import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StepperDataService} from "../../services/stepper-data.service";

@Component({
  selector: 'app-academic-info',
  templateUrl: './academic-info.component.html',
  styleUrls: ['./academic-info.component.css']
})
export class AcademicInfoComponent implements OnInit {

  @Output() academicInfoEvent = new EventEmitter<FormGroup>();
  academicFormGroup!: FormGroup;

  constructor(private _formBuilder: FormBuilder, private stepperContentService: StepperDataService) {
  }

  ngOnInit(): void {
    this.academicFormGroup = this._formBuilder.group({
      memberID: [{value: '', disabled: true}, [Validators.required]],
      idYear: ['', [Validators.required, Validators.min(1)]],
      university: ['', [Validators.required, Validators.minLength(3)]],
      faculty: ['', [Validators.required, Validators.minLength(3)]],
      department: ['', [Validators.required, Validators.minLength(3)]],
      section: ['', [Validators.required, Validators.minLength(3)]],
    });

    const savedData = this.stepperContentService.getStepData(1);
    if (savedData) {
      this.academicFormGroup.patchValue(savedData);
    }

  }
  onSave() {
    this.academicInfoEvent.emit(this.academicFormGroup);
  }
  /*


  onPrevious() {
    this.previous.emit();
  }

   */

}

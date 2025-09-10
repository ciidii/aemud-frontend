import { Component, forwardRef, OnInit } from '@angular/core';
import {
  ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import {
  ValidationMessageComponent
} from "../../../../../shared/components/validation-message/validation-message.component";

@Component({
  selector: 'app-academic-info-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './academic-info-form.component.html',
  styleUrls: ['./academic-info-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AcademicInfoFormComponent),
      multi: true
    }
  ]
})
export class AcademicInfoFormComponent implements ControlValueAccessor, OnInit {
  get academicInfoForm(): FormGroup {
    return this._academicInfoForm;
  }

  private _academicInfoForm!: FormGroup;
  onTouched: () => void = () => {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this._academicInfoForm = this.fb.group({
      // Infos Académiques Actuelles
      institutionName: ['', Validators.required],
      studiesDomain: ['', Validators.required],
      studiesLevel: ['', Validators.required],
      // Infos BAC
      bacSeries: ['', Validators.required],
      bacMention: ['', Validators.required],
      yearOfBac: ['', Validators.required],
      // Infos AEMUD et autres
      legacyInstitution: [''],
      aemudCourses: [''],
      otherCourses: [''],
      participatedActivity: [''],
      politicOrganisation: ['']
    });
  }

  writeValue(val: any): void {
    val && this._academicInfoForm.setValue(val, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this._academicInfoForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this._academicInfoForm.disable() : this._academicInfoForm.enable();
  }

  get institutionName() {
    return this._academicInfoForm.get('institutionName');
  }

  get studiesDomain() {
    return this._academicInfoForm.get('studiesDomain');
  }

  get studiesLevel() {
    return this._academicInfoForm.get('studiesLevel');
  }

  get bacSeries() {
    return this._academicInfoForm.get('bacSeries');
  }

  get bacMention() {
    return this._academicInfoForm.get('bacMention');
  }

  get yearOfBac() {
    return this._academicInfoForm.get('yearOfBac');
  }

  get legacyInstitution() {
    return this._academicInfoForm.get('legacyInstitution');
  }

  get aemudCourses() {
    return this._academicInfoForm.get('aemudCourses');
  }

  get otherCourses() {
    return this._academicInfoForm.get('otherCourses');
  }

  get participatedActivity() {
    return this._academicInfoForm.get('participatedActivity');
  }

  get politicOrganisation() {
    return this._academicInfoForm.get('politicOrganisation');
  }
}

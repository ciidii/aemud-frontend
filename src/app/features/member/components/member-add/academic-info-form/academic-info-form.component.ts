import {Component, forwardRef, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators
} from "@angular/forms";
import {CommonModule} from "@angular/common";
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
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AcademicInfoFormComponent),
      multi: true
    }
  ]
})
export class AcademicInfoFormComponent implements ControlValueAccessor, OnInit, Validator {
  academicInfoForm!: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  get institutionName() {
    return this.academicInfoForm.get('institutionName');
  }

  get studiesDomain() {
    return this.academicInfoForm.get('studiesDomain');
  }

  get studiesLevel() {
    return this.academicInfoForm.get('studiesLevel');
  }

  get bacSeries() {
    return this.academicInfoForm.get('bacSeries');
  }

  get bacMention() {
    return this.academicInfoForm.get('bacMention');
  }

  get yearOfBac() {
    return this.academicInfoForm.get('yearOfBac');
  }

  get legacyInstitution() {
    return this.academicInfoForm.get('legacyInstitution');
  }

  get aemudCourses() {
    return this.academicInfoForm.get('aemudCourses');
  }

  get otherCourses() {
    return this.academicInfoForm.get('otherCourses');
  }

  get participatedActivity() {
    return this.academicInfoForm.get('participatedActivity');
  }

  get politicOrganisation() {
    return this.academicInfoForm.get('politicOrganisation');
  }

  onTouched: () => void = () => {
  };

  ngOnInit(): void {
    this.academicInfoForm = this.fb.group({
      // Infos Académiques Actuelles
      institutionName: ['', [Validators.required, Validators.minLength(3)]],
      studiesDomain: ['', [Validators.required, Validators.minLength(3)]],
      studiesLevel: ['', [Validators.required, Validators.minLength(3)]],
      // Infos BAC
      bacSeries: ['', [Validators.required, Validators.minLength(3)]],
      bacMention: ['', [Validators.required, Validators.minLength(3)]],
      yearOfBac: ['', Validators.required],
      // Infos AEMUD et autres
      legacyInstitution: ['', Validators.minLength(3)],
      aemudCourses: ['', Validators.minLength(3)],
      otherCourses: ['', Validators.minLength(3)],
      participatedActivity: ['', Validators.minLength(3)],
      politicOrganisation: ['', Validators.minLength(3)]
    });
  }

  writeValue(val: any): void {
    val && this.academicInfoForm.patchValue(val, {emitEvent: false});
  }

  registerOnChange(fn: any): void {
    this.academicInfoForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.academicInfoForm.disable() : this.academicInfoForm.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.academicInfoForm.valid ? null : {invalid: true};
  }
}

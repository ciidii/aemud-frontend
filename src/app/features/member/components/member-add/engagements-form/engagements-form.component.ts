import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators
} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Club, Commission} from "../../../../../core/models/member-data.model";
import {
  ValidationMessageComponent
} from "../../../../../shared/components/validation-message/validation-message.component";
import {
  CustomMultiselectComponent
} from "../../../../../shared/components/custom-multiselect/custom-multiselect.component";
import {BourseModel} from "../../../../../core/models/bourse.model";

@Component({
  selector: 'app-engagements-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidationMessageComponent, CustomMultiselectComponent, FormsModule],
  templateUrl: './engagements-form.component.html',
  styleUrls: ['./engagements-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EngagementsFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EngagementsFormComponent),
      multi: true
    }
  ]
})
export class EngagementsFormComponent implements ControlValueAccessor, OnInit, Validator {
  @Input() bourses: BourseModel[] = [];
  @Input() clubs: Club[] = [];
  @Input() commissions: Commission[] = [];

  engagementsForm!: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  // Getters for easy access in template
  get bourse() {
    return this.engagementsForm.get('bourse');
  }

  get clubs_() {
    return this.engagementsForm.get('clubs');
  }

  get commissions_() {
    return this.engagementsForm.get('commissions');
  }

  onTouched: () => void = () => {
  };

  ngOnInit(): void {
    this.engagementsForm = this.fb.group({
      bourse: [null, Validators.required],
      clubs: [[], Validators.required],
      commissions: [[], Validators.required]
    });
  }

  writeValue(val: any): void {
    val && this.engagementsForm.patchValue(val, {emitEvent: false});
  }

  registerOnChange(fn: any): void {
    this.engagementsForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.engagementsForm.disable() : this.engagementsForm.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.engagementsForm.valid ? null : {invalid: true};
  }
}

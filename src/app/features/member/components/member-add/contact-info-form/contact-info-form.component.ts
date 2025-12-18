import {Component, forwardRef, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
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
  selector: 'app-contact-info-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './contact-info-form.component.html',
  styleUrls: ['./contact-info-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContactInfoFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ContactInfoFormComponent),
      multi: true
    }
  ]
})
export class ContactInfoFormComponent implements ControlValueAccessor, OnInit, Validator {

  contactInfoForm!: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  // --- Getters pour les champs simples ---
  get numberPhone() {
    return this.contactInfoForm.get('numberPhone');
  }

  get email() {
    return this.contactInfoForm.get('email');
  }

  get addressInDakar() {
    return this.contactInfoForm.get('addressInDakar');
  }

  // --- Getters et méthodes pour le FormArray ---
  get personToCalls(): FormArray {
    return this.contactInfoForm.get('personToCalls') as FormArray;
  }

  onTouched: () => void = () => {
  };

  ngOnInit(): void {
    this.contactInfoForm = this.fb.group({
      numberPhone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      addressInDakar: ['', Validators.required],
      addressOnCampus: [''],
      personToCalls: this.fb.array([])
    });
  }

  getPersonControl(index: number, controlName: string) {
    return this.personToCalls.at(index).get(controlName);
  }

  addPersonToCall(): void {
    this.personToCalls.push(this.newPersonToCall());
  }

  removePersonToCall(index: number): void {
    this.personToCalls.removeAt(index);
  }

  writeValue(val: any): void {
    if (val) {
      this.contactInfoForm.patchValue(val, {emitEvent: false});
      this.personToCalls.clear();
      // @ts-ignore
      val.personToCalls.forEach(person => {
        this.personToCalls.push(this.fb.group(person));
      });
    }
  }

  registerOnChange(fn: any): void {
    this.contactInfoForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.contactInfoForm.disable() : this.contactInfoForm.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.contactInfoForm.valid ? null : {invalid: true};
  }

  private newPersonToCall(): FormGroup {
    return this.fb.group({
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      requiredNumberPhone: ['', [Validators.required, Validators.minLength(3)]],
      optionalNumberPhone: [''],
      relationship: ['', [Validators.required, Validators.minLength(3)]]
    });
  }
}

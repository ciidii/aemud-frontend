import {Component, forwardRef, OnInit} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators, FormArray
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
    }
  ]
})
export class ContactInfoFormComponent implements ControlValueAccessor, OnInit {

  contactInfoForm!: FormGroup;
  onTouched: () => void = () => {
  };

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.contactInfoForm = this.fb.group({
      numberPhone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      addressInDakar: ['', Validators.required],
      holidayAddress: [''],
      addressToCampus: [''],
      personToCalls: this.fb.array([])
    });
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

  getPersonControl(index: number, controlName: string) {
    return this.personToCalls.at(index).get(controlName);
  }

  private newPersonToCall(): FormGroup {
    return this.fb.group({
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      requiredNumberPhone: ['', Validators.required],
      optionalNumberPhone: [''],
      relationship: ['', Validators.required]
    });
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
}

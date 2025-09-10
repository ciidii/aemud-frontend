import { Component, forwardRef, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import {
  ValidationMessageComponent
} from "../../../../shared/components/validation-message/validation-message.component";

@Component({
  selector: 'app-personal-info-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './personal-info-form.component.html',
  styleUrls: ['./personal-info-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PersonalInfoFormComponent),
      multi: true
    }
  ]
})
export class PersonalInfoFormComponent implements ControlValueAccessor, OnInit {

  personalInfoForm!: FormGroup; // Initialized in ngOnInit, so we use '!'
  onTouched: () => void = () => {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.personalInfoForm = this.fb.group({
      name: ['', Validators.required],
      firstname: ['', Validators.required],
      nationality: ['', Validators.required],
      gender: ['', Validators.required],
      birthday: ['', Validators.required],
      maritalStatus: ['', Validators.required]
    });
  }

  // Getters for easy access in template
  get name() { return this.personalInfoForm.get('name'); }
  get firstname() { return this.personalInfoForm.get('firstname'); }
  get nationality() { return this.personalInfoForm.get('nationality'); }
  get gender() { return this.personalInfoForm.get('gender'); }
  get birthday() { return this.personalInfoForm.get('birthday'); }
  get maritalStatus() { return this.personalInfoForm.get('maritalStatus'); }

  writeValue(val: any): void {
    val && this.personalInfoForm.setValue(val, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.personalInfoForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.personalInfoForm.disable() : this.personalInfoForm.enable();
  }
}

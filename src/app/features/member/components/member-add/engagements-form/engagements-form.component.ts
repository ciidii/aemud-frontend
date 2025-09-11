import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators
} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Bourse, Club, Commission} from "../../../../../core/models/member-data.model";
import {ValidationMessageComponent} from "../../../../../shared/components/validation-message/validation-message.component";
import {
  CustomMultiselectComponent
} from "../../../../../shared/components/custom-multiselect/custom-multiselect.component";
import {FormsModule} from "@angular/forms";

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
    }
  ]
})
export class EngagementsFormComponent implements ControlValueAccessor, OnInit {
  @Input() bourses: Bourse[] = [];
  @Input() clubs: Club[] = [];
  @Input() commissions: Commission[] = [];

  engagementsForm!: FormGroup;
  onTouched: () => void = () => {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.engagementsForm = this.fb.group({
      bourse: [null, Validators.required],
      clubs: [[]],
      commissions: [[]]
    });
  }

  // Getters for easy access in template
  get bourse() { return this.engagementsForm.get('bourse'); }
  get clubs_() { return this.engagementsForm.get('clubs'); }
  get commissions_() { return this.engagementsForm.get('commissions'); }

  writeValue(val: any): void {
    val && this.engagementsForm.patchValue(val, { emitEvent: false });
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
}


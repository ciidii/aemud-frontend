import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule
} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Bourse, Club, Commission} from "../../../../core/models/member-data.model";

@Component({
  selector: 'app-engagements-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
      bourse: [null],
      clubs: [[]], // Le formControl va maintenant contenir directement le tableau d'IDs
      commissions: [[]] // Idem pour les commissions
    });
  }

  writeValue(val: any): void {
    // La valeur peut être patchée directement si elle correspond à la structure
    val && this.engagementsForm.patchValue(val, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    // La valeur du formulaire est maintenant directement ce dont le parent a besoin
    this.engagementsForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.engagementsForm.disable() : this.engagementsForm.enable();
  }
}


import { CommonModule } from "@angular/common";
import {ArabicProficiency, CORAN_LEVEL} from "../../../../../core/models/member-data.model";
import {Component, forwardRef, OnInit} from "@angular/core";
import {
  ControlValueAccessor, FormArray,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {ValidationMessageComponent} from "../../../../../shared/components/validation-message/validation-message.component";

@Component({
  selector: 'app-religious-knowledge-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './religious-knowledge-form.component.html',
  styleUrls: ['./religious-knowledge-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReligiousKnowledgeFormComponent),
      multi: true
    }
  ]
})
export class ReligiousKnowledgeFormComponent implements ControlValueAccessor, OnInit {

  religiousKnowledgeForm!: FormGroup;
  onTouched: () => void = () => {};

  // Exposer les enums au template
  coranLevels = Object.values(CORAN_LEVEL);
  arabicProficiencyLevels = Object.values(ArabicProficiency);
  // Map pour les libellés du template
  proficiencyLabels = {
    [ArabicProficiency.CANNOT_READ]: 'Ne sait pas lire',
    [ArabicProficiency.READ_ONLY]: 'Sait lire sans comprendre',
    [ArabicProficiency.READ_AND_UNDERSTAND]: 'Sait lire et comprendre'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.religiousKnowledgeForm = this.fb.group({
      arabicProficiency: [null, Validators.required],
      coranLevel: [''],
      aqida: this.fb.array([]),
      fiqh: this.fb.array([])
    });
  }

  // --- Getters pour un accès facile dans le template ---
  get arabicProficiency() { return this.religiousKnowledgeForm.get('arabicProficiency'); }

  get aqida(): FormArray {
    return this.religiousKnowledgeForm.get('aqida') as FormArray;
  }

  get fiqh(): FormArray {
    return this.religiousKnowledgeForm.get('fiqh') as FormArray;
  }

  getKnowledgeControl(formArrayName: 'aqida' | 'fiqh', index: number, controlName: string) {
    return (this.religiousKnowledgeForm.get(formArrayName) as FormArray).at(index).get(controlName);
  }

  // --- Méthodes pour créer et manipuler les FormArray ---
  private newKnowledgeGroup(): FormGroup {
    return this.fb.group({
      acquired: [true], // Par défaut à true quand on ajoute un bloc
      bookName: ['', Validators.required],
      teacherName: [''],
      learningPlace: ['']
    });
  }

  addAqida(): void {
    this.aqida.push(this.newKnowledgeGroup());
  }

  removeAqida(index: number): void {
    this.aqida.removeAt(index);
  }

  addFiqh(): void {
    this.fiqh.push(this.newKnowledgeGroup());
  }

  removeFiqh(index: number): void {
    this.fiqh.removeAt(index);
  }

  // --- Implémentation de ControlValueAccessor ---
  writeValue(val: any): void {
    val && this.religiousKnowledgeForm.setValue(val, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.religiousKnowledgeForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.religiousKnowledgeForm.disable() : this.religiousKnowledgeForm.enable();
  }
}

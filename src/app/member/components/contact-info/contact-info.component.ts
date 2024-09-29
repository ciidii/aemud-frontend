import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StepperDataService} from "../../../core/services/stepper-data.service";

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent implements OnInit {
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() contactInfoEvent = new EventEmitter<FormGroup>
  contactFormGroup!: FormGroup;

  constructor(private _formBuilder: FormBuilder, private stepperDataService: StepperDataService) {
  }

  ngOnInit() {
    this.contactFormGroup = this._formBuilder.group({
      memberID: [{value: '', disabled: true}, [Validators.required]],
      idYear: ['', [Validators.required, Validators.min(1)]],
      numberPhone: ['', [Validators.required, Validators.pattern(/^\+221\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      personToCalls: this._formBuilder.array([]),
    });
    this.addPersonToCall()
    // Récupérer les données précédemment enregistrées si elles existent
    const savedData = this.stepperDataService.getStepData(2);
    if (savedData) {
      this.contactFormGroup.patchValue(savedData);
    }
  }

  get personToCalls(): FormArray {
    return this.contactFormGroup.get('personToCalls') as FormArray;
  }

  addPersonToCall(person?: any): void {
    // Limiter à 2 personnes à contacter
    if (this.personToCalls.length >= 2) {
      alert("Vous ne pouvez ajouter que deux personnes à contacter.");
      return;
    }

    const personFormGroup = this._formBuilder.group({
      lastname: [person?.lastname || '', Validators.required],
      firstname: [person?.firstname || '', Validators.required],
      requiredNumberPhone: [
        person?.requiredNumberPhone || '',
        [Validators.required, Validators.pattern(/^\+221\d{9}$/)],
      ],
      optionalNumberPhone: [
        person?.optionalNumberPhone || '',
        Validators.pattern(/^\+221\d{9}$/),
      ],
      relationship: [person?.relationship || '', Validators.required],
    });

    this.personToCalls.push(personFormGroup);
  }

  removePersonToCall(index: number): void {
    this.personToCalls.removeAt(index);
  }

  onSave() {
    this.stepperDataService.setFormData(2, this.contactFormGroup.value);
    this.contactInfoEvent.emit(this.contactFormGroup)
  }
}
